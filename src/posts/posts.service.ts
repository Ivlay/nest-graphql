import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  async findAll() {
    return await this.postModel.find().exec();
  }

  async findById(postId: string) {
    try {
      const post = await this.postModel.findById(postId);

      if (post) {
        return post;
      }

      throw new Error('Post not found');
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
    } catch (error) {}
  }
}
