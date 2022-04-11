import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/schemas/user.schemas';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment-dto';
import { Comment } from './schemas/comment.schema';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}
  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: User,
  ) {
    return await this.commentsService.create(createCommentInput, user);
  }
}
