import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/users/user.decorator';
import { CreatePostInput } from './dto/create-post-dto';
import { PostsService } from './posts.service';
import { Post } from './schemas/post.schemas';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  @Query(() => [Post], { name: 'posts' })
  @UseGuards(GqlAuthGuard)
  async getPosts() {
    return this.postsService.findAll();
  }
  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user,
  ) {
    console.log('user', user)
    return await this.postsService.create(createPostInput);
  }
  @ResolveField()
  async commentsCount(@Parent() post) {
    return post.likes.length;
  }
  @ResolveField()
  async likesCount(@Parent() post) {
    return post.comments.length;
  }
}
