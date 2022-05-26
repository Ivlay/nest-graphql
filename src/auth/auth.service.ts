import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { Response } from 'express';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schemas';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtServise: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user) {
      const valid = await bcrypt.compare(password, user.password);

      if (valid) {
        return user;
      } else {
        throw new AuthenticationError('Password is not exist');
      }
    } else {
      throw new AuthenticationError('Username or email is not exist');
    }
  }

  async validateUserById(id: string) {
    return this.usersService.findById(id);
  }

  async login(user: User, res: Response) {
    const access_token = this.jwtServise.sign({
      username: user.username,
      sub: user.id,
    });

    res.cookie('access_token', access_token, {
      expires: dayjs().set('hour', 1).add(26, 'hours').toDate(),
      httpOnly: true,
    });

    return {
      access_token,
      user,
    };
  }

  async signup(createUserInput: CreateUserInput, res: Response) {
    const { username, email, password, confirmPassword } = createUserInput;

    if (password !== confirmPassword) {
      throw new UserInputError('Password and Confirm Password must be equal!');
    }

    const user = await this.usersService.findOne(username, email);

    if (user) {
      throw new UserInputError('User already exist!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    createUserInput.password = hashedPassword;

    const createdUser = await this.usersService.create(createUserInput);

    const access_token = this.jwtServise.sign({
      username: createdUser.username,
      sub: createdUser.id,
    });

    res.cookie('access_token', access_token, {
      expires: dayjs().set('hour', 1).add(26, 'hours').toDate(),
      httpOnly: true,
    });

    return {
      user: createdUser,
      access_token,
    };
  }
}
