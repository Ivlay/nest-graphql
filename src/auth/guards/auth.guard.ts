import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const loginUserInput = ctx.getArgs().loginUserInput;

    const request = ctx.getContext();

    if (loginUserInput) {
      const user = await this.authService.validateUser(
        loginUserInput.username,
        loginUserInput.password,
      );

      if (!user) {
        return false;
      } else {
        request.body = user;
      }
    }

    return true;
  }
}
