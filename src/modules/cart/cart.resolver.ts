import { Args, Resolver, Query, Mutation, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { UseGuards } from '@nestjs/common';
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

     @Query(() => CartModel)
     async listCart(@Args('input') body: BasePaginationInput,
          @AuthUser() auth: UserEntity
     ): Promise<IPaginatedType<CartEntity>> {
          return this.cartService.search(body);
     }
}
