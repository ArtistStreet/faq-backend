import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/entities/cart.entity';
import { CartItemEntity } from 'src/entities/cart_item.entity';
import { DataLoaderModule } from 'src/data-loader/data-loaders.module';
import { CategoryEntity } from 'src/entities/category.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderItemEntity } from 'src/entities/order_item.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
     imports: [
          TypeOrmModule.forFeature([CartEntity, CategoryEntity, CartItemEntity,
               OrderEntity, OrderItemEntity, ProductEntity]),
          DataLoaderModule,
     ],
     providers: [CartResolver, CartService]
})
export class CartModule { }
