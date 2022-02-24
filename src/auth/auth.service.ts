import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInputError } from 'apollo-server-express';
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

    const valid = await bcrypt.compare(password, user?.password);

    if (user && valid) {
      return user;
    }

    return null;
  }

  async login(context) {
    const { user, res, req } = context;

    const access_token = this.jwtServise.sign({
      username: user.username,
      sub: user.id,
    });

    res.cookie('access_token', access_token);

    return {
      access_token,
      user,
    };
  }

  async signup(createUserInput: CreateUserInput) {
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

    return this.usersService.create(createUserInput);
  }
}
