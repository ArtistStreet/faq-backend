import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from 'src/modules/auth/dto/loginRespone';
import { LoginInput } from 'src/modules/auth/dto/loginInput';
import { UserEntity } from 'src/entities/user.entity';

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
}
