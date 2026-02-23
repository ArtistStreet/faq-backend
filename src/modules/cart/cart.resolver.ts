import { Args, Resolver, Query, Mutation, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { CartEntity } from 'src/entities/cart.entity';
import { GqlJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartModel } from './models/cart.model';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { AuthUser } from '../auth/auth.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { IPaginatedType } from 'src/common/bases/base.model';

@Resolver(() => CartEntity)
@UseGuards(GqlJwtAuthGuard)
export class CartResolver {
     constructor(
          private readonly cartService: CartService,
     ) { };

     @Mutation(() => CartEntity)
     async addToCart(
          @Args('quantity', { type: () => Int }) quantity: number,
          @Args('productId', { type: (() => Int) }) productId: number,
          @AuthUser() auth: UserEntity
     ) {
          return this.cartService.addToCart(auth, quantity, productId);
     }

     @Query(() => CartEntity)
     @UseGuards(GqlJwtAuthGuard)
     async detailCart(
          @Args('id', { type: () => Int }) id: number,
          @AuthUser() auth: UserEntity
     ) {
          return this.cartService.findOne(
               {
                    where: { user: { id: auth.id } },
                    relations: ['cart_item', 'cart_item.product']
               }
          ).then((res) => {
               if (!res) throw new NotFoundException();
               return res;
          })
     }

     @Mutation(() => CartEntity)
     @UseGuards(GqlJwtAuthGuard)
     async removeCart(
          @Args('productId', { type: () => Int }) productId: number,
          @AuthUser() auth: UserEntity
     ) {
          return this.cartService.removeFromCart(auth, productId);
     }

     @Mutation(() => Boolean)
     @UseGuards(GqlJwtAuthGuard)
     async clearCart(@AuthUser() auth: UserEntity) {
          return this.cartService.clearCart(auth);
     }
}
