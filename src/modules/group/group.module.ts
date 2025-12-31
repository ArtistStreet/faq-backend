// group.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupResolver } from './group.resolver';
import { GroupService } from './group.service';
import { Group } from '../../entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group])], // ← Quan trọng: đăng ký entity
  providers: [GroupResolver, GroupService],
})
export class GroupModule {}
