// group.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupResolver } from './group.resolver';
import { GroupService } from './group.service';
import { GroupEntity } from '../../entities/group.entity';

@Module({
     imports: [TypeOrmModule.forFeature([GroupEntity])], // ← Quan trọng: đăng ký entity
     providers: [GroupResolver, GroupService],
})
export class GroupModule { }
