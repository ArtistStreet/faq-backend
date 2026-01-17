import { ObjectType } from '@nestjs/graphql';
import { BasePaginatedModel } from 'src/common/bases/base.model';
import { CategoryEntity } from 'src/entities/category.entity';

@ObjectType()
export class CategoryModel extends BasePaginatedModel(CategoryEntity) { }
