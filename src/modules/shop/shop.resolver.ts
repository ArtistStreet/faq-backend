import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { ShopService } from './shop.service';
import { ShopEntity } from 'src/entities/shop.entity';
import { CreateShopInput } from './dto/create-shop.input';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUser } from '../auth/auth.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
@UseGuards(GqlJwtAuthGuard)
export class ShopResolver {
     constructor(private readonly shopService: ShopService) { };

     @Mutation(() => ShopEntity)
     async createShop(@Args('input') input: CreateShopInput, @AuthUser() auth: UserEntity): Promise<ShopEntity> {
          return this.shopService.create({ ...input, created_by: auth.id });
     }

     @Mutation(() => ShopEntity)
     async updateShop(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: CreateShopInput,
          @AuthUser() auth: UserEntity
     ): Promise<ShopEntity> {
          return this.shopService.updateOne(id, { ...input, updated_by: auth.id });
     }

     @Mutation(() => Boolean)
     async deleteShop(@Args('id', { type: () => Int }) id: number) {
          await this.shopService.softDelete(id);
          return true;
     }
}
