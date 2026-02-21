import { ObjectType } from '@nestjs/graphql';
import { BasePaginatedModel } from 'src/common/bases/base.model';
import { CartEntity } from 'src/entities/cart.entity';

@ObjectType()
export class CartModel extends BasePaginatedModel(CartEntity) { }
