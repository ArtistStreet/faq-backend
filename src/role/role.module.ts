import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';

@Module({
     imports: [TypeOrmModule.forFeature([Role])], // ← Quan trọng: đăng ký entity
     providers: [RoleService, RoleResolver]
})
export class RoleModule { }
