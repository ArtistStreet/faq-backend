import { Args, Resolver, Mutation, Int, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from 'src/modules/auth/dto/login-respone';
import { LoginInput, RegisterInput } from 'src/modules/auth/dto/login-input';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUser } from './auth.decorator';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { UserModel } from './models/auth.model';
import { IPaginatedType } from 'src/common/bases/base.model';
import { GqlJwtAuthGuard } from './guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Resolver()
export class AuthResolver {
     constructor(private readonly authService: AuthService) { }

     @Query(() => UserEntity)
     @UseGuards(GqlJwtAuthGuard)
     me(@CurrentUser() user: UserEntity) {
          return this.authService.findById(user.id);
     }

     @Query(() => UserModel)
     async listUser(@Args('input') body: BasePaginationInput): Promise<IPaginatedType<UserEntity>> {
          return this.authService.search(body);
     }

     @Mutation(() => UserEntity)
     async register(@Args('input') input: RegisterInput): Promise<UserEntity> {
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

     @UseGuards(GqlJwtAuthGuard)
     @Roles(Role.ADMIN)
     @Mutation(() => Boolean)
     async deleteUser(@Args('id', { type: () => Int }) id: number) {
          await this.authService.delete(id);
          return true;
     }
}
