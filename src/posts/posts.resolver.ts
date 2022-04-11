import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Query,
  Resolver,
  Int,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/schemas/comment.schema';
import { User } from 'src/users/schemas/user.schemas';
import { UsersService } from 'src/users/users.service';
import { CreatePostInput } from './dto/create-post-dto';
import { PostsService } from './posts.service';
import { Post } from './schemas/post.schemas';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private usersService: UsersService,
    private commentsService: CommentsService,
  ) {}

  @Query(() => [Post], { name: 'posts' })
  async getPosts() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  async getPost(@Args('postId') postId: string) {
    return await this.postsService.findById(postId);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ) {
    return await this.postsService.create(createPostInput, user);
  }
  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async likePost(@Args('postId') postId: string, @CurrentUser() user: User) {
    return await this.postsService.likePost(postId, user);
  }

  @ResolveField(() => Int)
  async likesCount(@Parent() post: Post) {
    return post.likes.length;
  }
  @ResolveField(() => Int)
  async commentsCount(@Parent() post: Post) {
    return (await this.commentsService.findCommentsByPostId(post.id)).length;
  }

  @ResolveField(() => [Comment])
  async comments(@Parent() post: Post) {
    return this.commentsService.findCommentsByPostId(post.id);
  }
  @ResolveField(() => User)
  async user(@Parent() post: Post) {
    return this.usersService.findById(post.userId);
  }
}
