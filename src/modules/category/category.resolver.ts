import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryModel } from './models/category.model';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { IPaginatedType } from 'src/common/bases/base.model';

@Resolver()
export class CategoryResolver {
     constructor(private readonly categoryService: CategoryService) { }

     @Query(() => CategoryModel)
     async categoryList(@Args('input') body: BasePaginationInput): Promise<IPaginatedType<CategoryEntity>> {
          return this.categoryService.search(body);
     }

     @Mutation(() => CategoryEntity)
     async createCategory(@Args('input') input: CreateCategoryInput): Promise<CategoryEntity> {
          return this.categoryService.create(input);
     }

     @Mutation(() => CategoryEntity)
     async updateCategory(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: CreateCategoryInput,
     ): Promise<CategoryEntity> {
          return this.categoryService.updateOne(id, input);
     }

     @Mutation(() => Boolean)
     async deleteCategory(@Args('id', { type: () => Int }) id: number) {
          await this.categoryService.softDelete(id);
          return true;
     }

}
