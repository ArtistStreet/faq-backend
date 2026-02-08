import { ObjectType } from '@nestjs/graphql';
import { BasePaginatedModel } from 'src/common/bases/base.model';
import { ProductEntity } from 'src/entities/product.entity';

@ObjectType()
export class ProductModel extends BasePaginatedModel(ProductEntity) { }
