import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { ProductEntity } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { UserEntity } from 'src/entities/user.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { ShopEntity } from 'src/entities/shop.entity';

@Injectable()
export class ProductService extends BaseService<ProductEntity> {
     constructor(
          @InjectRepository(ProductEntity)
          private readonly repo: Repository<ProductEntity>,

          @InjectRepository(CategoryEntity)
          private readonly categoryRepository: Repository<CategoryEntity>,

          @InjectRepository(ShopEntity)
          private readonly shopRepository: Repository<ShopEntity>,
     ) { super(repo) }

     async createProduct(input: CreateProductInput, auth: UserEntity): Promise<ProductEntity> {
          const { categoryIds, ...data } = input;

          const shop = await this.shopRepository.findOne({
               where: { owner: { id: auth.id } }
          });

          if (!shop) {
               throw new Error('Shop not found');
          }

          const product = this.repo.create({
               ...data,
               shop
          });

          if (categoryIds?.length) {
               product.category = categoryIds.map(id => ({ id } as CategoryEntity));
          }

          const save = await this.repo.save(product);

          const foundProduct = await this.repo.findOne({
               where: { id: save.id },
               relations: ['category', 'shop'],
          });

          if (!foundProduct) {
               throw new Error('Product not found after creation');
          }

          return foundProduct;
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
