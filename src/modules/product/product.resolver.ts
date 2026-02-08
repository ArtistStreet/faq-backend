import { Args, Resolver, Query, Mutation, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/entities/product.entity';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { ProductModel } from './models/product.model';
import { IPaginatedType } from 'src/common/bases/base.model';
import { CreateProductInput } from './dto/create-product.input';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUser } from '../auth/auth.decorator';

@Resolver()
export class ProductResolver {
     constructor(private readonly productService: ProductService) { }

     @Query(() => ProductModel)
     async listProduct(@Args('input') body: BasePaginationInput): Promise<IPaginatedType<ProductEntity>> {
          return this.productService.search(body);
     }

     @Mutation(() => ProductEntity)
     async createProduct(@Args('input') input: CreateProductInput, @AuthUser() auth: UserEntity): Promise<ProductEntity> {
          return this.productService.create({ ...input, created_by: auth.id });
     }

     @Mutation(() => ProductEntity)
     async updateProduct(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: CreateProductInput,
          @AuthUser() auth: UserEntity
     ): Promise<ProductEntity> {
          return this.productService.updateOne(id, { ...input, updated_by: auth.id });
     }

     @Mutation(() => Boolean)
     async deleteProduct(@Args('id', { type: () => Int }) id: number, @AuthUser() auth: UserEntity) {
          await this.productService.softDelete(id, auth.id);
          return true;
     }
}
