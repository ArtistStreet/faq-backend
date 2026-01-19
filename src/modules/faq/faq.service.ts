import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqEntity } from 'src/entities/faq.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateFaqInput } from './dto/create-faq.input';
import { BasePaginationInput } from 'src/common/bases/base.input';

@Injectable()
export class FaqService extends BaseService<FaqEntity> {
     constructor(
          @InjectRepository(FaqEntity)
          private readonly repo: Repository<FaqEntity>
     ) {
          super(repo);
     }

     public buildQuery(options: BasePaginationInput) {
          const query = super.buildQuery(options);

          query.leftJoinAndSelect('entity.category', 'category'); // Join từ bảng entity → category

          return query;
     }

     async createWithCategories(input: CreateFaqInput): Promise<FaqEntity> {
          const { categoryIds, ...data } = input;

          const faq = this.repo.create(data);

          if (categoryIds?.length) {
               faq.category = categoryIds.map(id => ({ id } as CategoryEntity));
          }

          const saved = await this.repo.save(faq);

          // LOAD LẠI RELATION
          const found = await this.repo.findOne({
               where: { id: saved.id },
               relations: ['category'],
          });
          if (!found) {
               throw new Error('FaqEntity not found after save');
          }
          return found;
     }

}