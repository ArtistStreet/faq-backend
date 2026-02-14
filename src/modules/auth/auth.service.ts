import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from 'src/modules/auth/dto/login-respone';
import { LoginInput, RegisterInput } from 'src/modules/auth/dto/login-input';
import { randomUUID } from 'crypto';
import { BaseService } from 'src/common/bases/base.service';

@Injectable()
export class AuthService extends BaseService<UserEntity> {
     constructor(
          private jwtService: JwtService,
          @InjectRepository(UserEntity)
          public userRepo: Repository<UserEntity>,
     ) {
          super(userRepo);
     }

     async register(input: RegisterInput): Promise<UserEntity> {
          const { email, password, name } = input;

          const exist = await this.userRepo.findOne({ where: { email } });
          if (exist) {
               throw new BadRequestException("Email already exists");
          }

          const hashedPass = await bcrypt.hash(password, 10);

          const user = this.userRepo.create({
               name,
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
               name: user.name,
               email: user.email,
               role: user.role,
          };

          return {
               accessToken: this.jwtService.sign(payload),
               user,
          };
     }

     async forgotPassword(email: string): Promise<boolean> {
          const user = await this.userRepo.findOne({ where: { email } });
          if (!user) {
               throw new UnauthorizedException('Email not found');
          }

          const token = randomUUID();

          user.resetPasswordToken = token;
          user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

          await this.userRepo.save(user);

          return true;
     }

     async resetPassword(token: string, newPassword: string): Promise<boolean> {
          const user = await this.userRepo.findOne({ where: { resetPasswordToken: token } })
          if (!user) {
               throw new UnauthorizedException('Invalid token');
          }

          if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
               throw new UnauthorizedException('Token expires');
          }

          user.password = await bcrypt.hash(newPassword, 10);

          await this.userRepo.save(user);

          user.resetPasswordExpires = null;
          user.resetPasswordToken = null;

          return true;
     }

     findById(id: number) {
          return this.userRepo.findOne({
               where: { id },
               relations: ['shop'], // cực kỳ quan trọng
          });
     }
}
