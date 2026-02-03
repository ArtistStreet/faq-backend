import { Args, Resolver, Mutation, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from 'src/modules/auth/dto/login-respone';
import { LoginInput } from 'src/modules/auth/dto/login-input';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUser } from './auth.decorator';

@Resolver()
export class AuthResolver {
     constructor(private readonly authService: AuthService) { }

     @Mutation(() => UserEntity)
     async register(@Args('input') input: LoginInput): Promise<UserEntity> {
          return this.authService.register(input);
     }

     @Mutation(() => LoginResponse)
     async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
          return this.authService.login(input);
     }

     @Mutation(() => Boolean)
     async forgotPassword(@Args('email') email: string) {
          return this.authService.forgotPassword(email);
     }

     @Mutation(() => Boolean)
     async resetPassword(
          @Args('token') token: string,
          @Args('newPassword') newPassword: string) {
          return this.authService.resetPassword(token, newPassword);
     }

     @Mutation(() => Boolean)
     async deleteUser(@Args('id', { type: () => Int }) id: number, @AuthUser() auth: UserEntity) {
          await this.authService.softDelete(id, auth.id);
          return true;
     }
}
