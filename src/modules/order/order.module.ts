import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/entities/cart.entity';
import { CartItemEntity } from 'src/entities/cart_item.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderItemEntity } from 'src/entities/order_item.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
     imports: [
          TypeOrmModule.forFeature([CartEntity, ProductEntity, CartItemEntity,
               OrderEntity, OrderItemEntity]),
     ],
     providers: [OrderService, OrderResolver]
})
export class OrderModule { }
