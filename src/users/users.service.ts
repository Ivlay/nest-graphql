import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  async findById(id: string) {
    return await this.userModel.findById(id);
  }
}
