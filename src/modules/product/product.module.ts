import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ProductEntity } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { DataLoaderModule } from 'src/data-loader/data-loaders.module';

@Module({
     imports: [
          TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
          DataLoaderModule,  // ✅ đúng
     ],
     providers: [ProductService, ProductResolver],
})
export class ProductModule { }

