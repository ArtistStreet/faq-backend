import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopResolver } from './shop.resolver';
import { ShopEntity } from 'src/entities/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
     imports: [TypeOrmModule.forFeature([ShopEntity])],
     providers: [ShopService, ShopResolver]
})
export class ShopModule { }
