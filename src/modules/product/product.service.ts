import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { ProductEntity } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { UserEntity } from 'src/entities/user.entity';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class ProductService extends BaseService<ProductEntity> {
     constructor(
          @InjectRepository(ProductEntity)
          private readonly repo: Repository<ProductEntity>,

          @InjectRepository(CategoryEntity)
          private readonly categoryRepository: Repository<CategoryEntity>,
     ) { super(repo) }

     async createProduct(input: CreateProductInput): Promise<ProductEntity> {
          const { categoryIds, ...data } = input;

          const product = this.repo.create(data);

          if (categoryIds?.length) {
               product.category = categoryIds.map(id => ({ id } as CategoryEntity));
          }

          const save = await this.repo.save(product);

          const found = await this.repo.findOne({
               where: { id: save.id },
               relations: ['category'],
          })

          if (!found) {
               throw new Error('ProductEntity not found after save');
          }

          return found;
     }

     async updateOneWithRelation(
          id: number,
          input: CreateProductInput,
          auth: UserEntity,
     ) {
          return this.updateOne(
               id,
               { ...input, updated_by: auth.id },
               async (product) => {

                    if (input.categoryIds) {
                         const categories = await this.categoryRepository.findBy({
                              id: In(input.categoryIds),
                         });

                         product.category = categories;
                    }

               }
          );
     }

     // async getProductDetail
}
