import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ShopService } from './shop.service';
import { ShopEntity } from 'src/entities/shop.entity';
import { CreateShopInput } from './dto/create-shop.input';

@Resolver()
export class ShopResolver {
     constructor(private readonly shopService: ShopService) { };

     @Mutation(() => ShopEntity)
     async createShop(@Args('input') input: CreateShopInput) {
          return this.shopService.create(input);
     }
}
