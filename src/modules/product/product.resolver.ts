import { Args, Resolver, Query, Mutation, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/entities/product.entity';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { ProductModel } from './models/product.model';
import { IPaginatedType } from 'src/common/bases/base.model';
import { CreateProductInput } from './dto/create-product.input';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUser } from '../auth/auth.decorator';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryEntity } from 'src/entities/category.entity';
import { DataLoaderService } from 'src/data-loader/data-loaders.service';
import { Role } from 'src/common/enums/role.enum';

@Resolver(() => ProductEntity)
@UseGuards(GqlJwtAuthGuard)
export class ProductResolver {
     constructor(
          private readonly productService: ProductService,
          private readonly dataLoader: DataLoaderService,
     ) { }

     @ResolveField(() => [CategoryEntity], { nullable: true })
     async category(@Parent() product: ProductEntity) {
          return this.dataLoader
               .relationBatchManyMany(CategoryEntity, 'product')
               .load(product.id);
     }

     @Query(() => ProductModel)
     async listProduct(@Args('input') body: BasePaginationInput,
          @AuthUser() auth: UserEntity
     ): Promise<IPaginatedType<ProductEntity>> {
          if ((auth.role) === Role.SELLER) {
               body.filters = [
                    ...(body.filters || []),
                    `shop.owner.id:=(${auth.id})`
               ]
          }
          return this.productService.search(body);
     }

     @Query(() => ProductEntity)
     async detailProduct(@Args('id', { type: () => Int }) id: number): Promise<ProductEntity> {
          return this.productService.findOne(id).then((res) => {
               if (!res) throw new NotFoundException();
               return res;
          })
     }

     @Mutation(() => ProductEntity)
     async createProduct(@Args('input') input: CreateProductInput, @AuthUser() auth: UserEntity): Promise<ProductEntity> {
          return this.productService.createProduct({ ...input });
     }

     @Mutation(() => ProductEntity)
     async updateProduct(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: CreateProductInput,
          @AuthUser() auth: UserEntity
     ): Promise<ProductEntity> {
          return this.productService.updateOneWithRelation(
               id,
               input,
               auth
          );
     }

     @Mutation(() => Boolean)
     async deleteProduct(@Args('id', { type: () => Int }) id: number, @AuthUser() auth: UserEntity) {
          await this.productService.softDelete(id, auth.id);
          return true;
     }
}
