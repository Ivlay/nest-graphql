import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Post, PostDocument } from './schemas/post.schemas';
import { CreatePostInput } from './dto/create-post-dto';
import { User } from 'src/users/schemas/user.schemas';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createUserInput: CreatePostInput) {
    const { body } = createUserInput;

    // const createdUser = await this.postModel.create({
    //   body,
    //   user,
    // });

    // return createdUser;
  }

  async findAll() {
    return await this.postModel.find().exec();
  }

  async findOne(postId: string) {
    return await this.postModel.findById(postId);
  }
}
