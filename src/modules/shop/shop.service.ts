import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { ShopEntity } from 'src/entities/shop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService extends BaseService<ShopEntity> {
     constructor(
          @InjectRepository(ShopEntity)
          private readonly repo: Repository<ShopEntity>
     ) {
          super(repo);
     }
}
