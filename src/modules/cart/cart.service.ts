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
export class CartService extends BaseService<CartEntity> {
     constructor(
          @InjectRepository(CartEntity)
          private readonly cartRepo: Repository<CartEntity>,

          @InjectRepository(ProductEntity)
          private readonly productRepo: Repository<ProductEntity>,

          @InjectRepository(CartItemEntity)
          private readonly cartItemRepo: Repository<CartItemEntity>,
     ) {
          super(cartRepo);
     }

     async addToCart(auth: UserEntity, quantity: number, productId: number): Promise<CartEntity> {
          const product = await this.productRepo.findOne({
               where: { id: productId }
          })

          if (!product) {
               throw new NotFoundException("Item not found!!!");
          }

          let cart = await this.cartRepo.findOne({
               where: { id: auth.id },
               relations: ['cart_item', 'cart_item.product']
          })

          if (!cart) {
               cart = this.cartRepo.create({
                    user: auth,
               })

               cart = await this.cartRepo.save(cart);
          }

          let existing = cart.cart_item.find(item => item.product.id === productId);

          if (existing) {
               existing.quantity += quantity;
               await this.cartItemRepo.save(existing);
          } else {
               const newItem = this.cartItemRepo.create({
                    cart,
                    product,
                    quantity
               })
               await this.cartItemRepo.save(newItem);
          }

          const found = await this.cartRepo.findOne({
               where: { id: cart.id },
               relations: ['cart_item', 'cart_item.product']
          });

          if (!found) {
               throw new Error('Product not found after creation');
          }

          return found;
     }

     async cartDetail(auth: UserEntity): Promise<CartEntity> {
          const cart = await this.cartRepo.findOne({
               where: { user: { id: auth.id } },
               relations: ['cart_item', 'cart_item.product']
          })

          if (!cart) {
               return this.cartRepo.create({
                    user: auth,
                    cart_item: []
               })
          }

          return cart;
     }

     async removeFromCart(auth: UserEntity, productId: number): Promise<CartEntity> {
          const cart = await this.cartRepo.findOne({
               where: { user: { id: auth.id } },
               relations: ['cart_item', 'cart_item.product']
          })

          if (!cart) throw new NotFoundException('Cart not found');

          const item = cart.cart_item.find(i => { i.product.id === productId })

          if (!item) throw new NotFoundException('Product no found');

          await this.cartItemRepo.remove(item);

          return this.cartDetail(auth);
     }

     async clearCart(auth: UserEntity): Promise<Boolean> {
          const cart = await this.cartRepo.findOne({
               where: { user: { id: auth.id } },
               relations: ['cart_item']
          })

          if (!cart) throw new NotFoundException('Cart not found');

          await this.cartItemRepo.remove(cart.cart_item);

          return true;
     }
}
