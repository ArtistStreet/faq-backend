import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ProductEntity } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';

@Module({
     imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
     providers: [ProductService, ProductResolver]
})
export class ProductModule { }
