import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from 'src/modules/auth/dto/loginRespone';
import { LoginInput } from 'src/modules/auth/dto/loginInput';

@Injectable()
export class AuthService {
     constructor(
          private jwtService: JwtService,
          @InjectRepository(UserEntity)
          private userRepo: Repository<UserEntity>,
     ) { }

     async register(input: LoginInput): Promise<UserEntity> {
          const { email, password } = input;

          const exist = await this.userRepo.findOne({ where: { email } });
          if (exist) {
               throw new BadRequestException("Email already exists");
          }

          const hashedPass = await bcrypt.hash(password, 10);

          const user = this.userRepo.create({
               email,
               password: hashedPass,
               role: 1,
          })

          return this.userRepo.save(user);
     }

     async login(input: LoginInput): Promise<LoginResponse> {
          const user = await this.userRepo.findOne({ where: { email: input.email } });
          if (!user) {
               throw new UnauthorizedException('Email not found');
          }

          const isMatch = await bcrypt.compare(input.password, user.password);
          if (!isMatch) {
               throw new UnauthorizedException('Wrong password');
          }

          const payload = {
               sub: user.id,
               email: user.email,
               role: user.role,
          };

          return {
               accessToken: this.jwtService.sign(payload),
               user,
          };
     }
}
