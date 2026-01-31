import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthResolver } from './auth.resolver';

@Module({
     imports: [
          PassportModule,
          TypeOrmModule.forFeature([UserEntity]),
          JwtModule.register({
               secret: process.env.JWT_SECRET || 'secret_key',
               signOptions: { expiresIn: '1d' }
          })
     ],
     providers: [AuthService, JwtStrategy, AuthResolver],
     exports: [AuthService],
})
export class AuthModule { }
