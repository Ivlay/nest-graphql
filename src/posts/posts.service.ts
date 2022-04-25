import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationError, ApolloError } from 'apollo-server-express';

import { Post, PostDocument } from './schemas/post.schemas';
import { CreatePostInput } from './dto/create-post-dto';
import { User } from 'src/users/schemas/user.schemas';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostInput: CreatePostInput, user: User) {
    const { body } = createPostInput;

    const createdPost = await this.postModel.create({
      body,
      userId: user.id,
      username: user.username,
    });

    return createdPost;
  }

  async remove(postId: string, user: User) {
    const removedPost = await this.postModel.findOneAndDelete({
      _id: postId,
      userId: user.id,
    });

    if (!removedPost) {
      throw new AuthenticationError('You cannot remove this post');
    }
  }

  async findAll(paging: any) {
    const [count, posts] = await Promise.all([
      this.postModel.count(),
      this.postModel
        .find()
        .sort({ [paging.orderBy]: paging.order })
        .skip(paging.skip)
        .limit(paging.limit)
        .exec(),
    ]);

    return { count, posts };
  }

  async findById(postId: string) {
    try {
      if (Types.ObjectId.isValid(postId)) {
        const post = await this.postModel.findById(postId);

        if (post) {
          return post;
        }
      }

      throw new ApolloError('Post not found');
    } catch (error) {
      throw new Error(error);
    }
  }

  async likePost(postId: string, user: User) {
    try {
      const post = await this.findById(postId);
      const likedPost = post.likes.find(
        (like) => like.username === user.username,
      );

      if (likedPost) {
        post.likes = post.likes.filter(
          (like) => like.username !== user.username,
        );
      } else {
        post.likes.push({
          username: user.username,
          createdAt: new Date().toISOString(),
        });
      }

      await post.save();

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }
}
