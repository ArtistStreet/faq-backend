import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { CategoryEntity } from 'src/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
     imports: [TypeOrmModule.forFeature([CategoryEntity])], // ← Quan trọng: đăng ký entity
     providers: [CategoryService, CategoryResolver]
})
export class CategoryModule { }
