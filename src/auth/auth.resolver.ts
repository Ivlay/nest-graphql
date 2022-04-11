import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/AuthGuard';
import { LoginResponse } from './dto/login-response';
import { CreateUserInput } from './dto/create-user.input';

import { LoginUserInput } from './dto/login-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(AuthGuard)
  login(
    @Args('loginUserInput') _loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.req);
  }

  @Mutation(() => LoginResponse)
  signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signup(createUserInput);
  }
}
