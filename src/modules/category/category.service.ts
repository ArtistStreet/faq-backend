import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
     constructor(
          @InjectRepository(CategoryEntity)
          private readonly repo: Repository<CategoryEntity>
     ) {
          super(repo);
     }
}