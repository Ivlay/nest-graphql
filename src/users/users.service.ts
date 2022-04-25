import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApolloError } from 'apollo-server-express';

import { User, UserDocument } from './schemas/user.schemas';
import { CreateUserInput } from 'src/auth/dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput) {
    const { username, email, password } = createUserInput;

    const createdUser = await this.userModel.create({
      username,
      email,
      password,
    });

    return createdUser;
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(username = '', email = '') {
    return await this.userModel.findOne({
      $or: [{ username }, { email: email || username }],
    });
  }

  async findById(userId: string) {
    try {
      if (Types.ObjectId.isValid(userId)) {
        const user = await this.userModel.findById(userId);

        if (user) {
          return user;
        }
      }

      throw new ApolloError('User not found');
    } catch (error) {
      throw new Error(error);
    }
  }
}
