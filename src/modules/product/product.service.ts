import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService extends BaseService<ProductEntity> {
     constructor(
          @InjectRepository(ProductEntity)
          private readonly repo: Repository<ProductEntity>
     ) { super(repo) }
}
