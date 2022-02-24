import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schemas';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { CreateUserInput } from './dto/create-user.input';
import { GqlAuthGuard } from './gql-auth.guard';
import { LoginUserInput } from './dto/login-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context()
    context,
  ) {
    return this.authService.login(context);
  }

  @Mutation(() => User)
  signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signup(createUserInput);
  }
}
