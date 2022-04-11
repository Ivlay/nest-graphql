import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentInput } from './dto/create-comment-dto';
import { User } from 'src/users/schemas/user.schemas';
import { UserInputError } from 'apollo-server-express';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private postsService: PostsService,
  ) {}

  async create(createCommentInput: CreateCommentInput, user: User) {
    try {
      if (!createCommentInput.body.trim()) {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty',
          },
        });
      }

      const post = await this.postsService.findById(createCommentInput.postId);

      if (post) {
        const createdComment = await this.commentModel.create({
          body: createCommentInput.body,
          userId: user.id,
          postId: post.id,
        });

        return createdComment;
      } else {
        throw new UserInputError('Post not found');
      }
    } catch (error) {}
  }

  async findCommentsByPostId(postId: string) {
    try {
      return await this.commentModel.find({ postId });
    } catch (error) {}
  }
}
