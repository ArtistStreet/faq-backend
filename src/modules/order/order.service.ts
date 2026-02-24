import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CartEntity } from 'src/entities/cart.entity';
import { CartItemEntity } from 'src/entities/cart_item.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderItemEntity } from 'src/entities/order_item.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
     constructor(
          @InjectRepository(OrderEntity)
          private readonly orderRepo: Repository<OrderEntity>,

          @InjectRepository(OrderItemEntity)
          private readonly orderItemRepo: Repository<OrderItemEntity>,

          @InjectRepository(CartEntity)
          private readonly cartRepo: Repository<CartEntity>,

          @InjectRepository(ProductEntity)
          private readonly productRepo: Repository<ProductEntity>,

          @InjectRepository(CartItemEntity)
          private readonly cartItemRepo: Repository<CartItemEntity>,
     ) { super(orderRepo) }


     async checkout(auth: UserEntity): Promise<OrderEntity> {
          const cart = await this.cartRepo.findOne({
               where: { user: { id: auth.id } },
               relations: ['cart_item']
          })

          if (!cart) throw new NotFoundException('Cart not found');

          for (const item of cart.cart_item) {
               if (item.quantity > item.product.stock) {
                    throw new BadRequestException(`Not enough ${item.product.name}`)
               }
          }

          const order = this.orderRepo.create({
               buyer: auth,
          })

          const saveOrder = await this.orderRepo.save(order);
          let totalAmount = 0;

          const orderItems: OrderItemEntity[] = [];

          for (const item of cart.cart_item) {
               totalAmount += item.quantity * item.product.price;

               const orderItem = await this.orderItemRepo.save({
                    order: saveOrder,
                    price: totalAmount,
                    quantity: item.quantity,
               })

               orderItems.push(orderItem);

               item.product.stock -= item.quantity;
               await this.productRepo.save(item.product);
          }

          await this.orderItemRepo.save(orderItems);

          saveOrder.total_price = totalAmount;
          await this.orderRepo.save(saveOrder);

          await this.cartItemRepo.remove(cart.cart_item);

          const foundOrder = await this.orderRepo.findOne({
               where: { id: saveOrder.id },
               relations: ['cart_item', 'cart_item.product']
          });

          if (!foundOrder) {
               throw new NotFoundException('Order not found');
          }

          return foundOrder;
     }
}
