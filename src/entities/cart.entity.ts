// entities/faq.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GroupEntity } from './group.entity';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from 'src/common/bases/base.entity';
import { Decimal128 } from 'typeorm/browser';
import { UserEntity } from './user.entity';
import { OrderStatus, PaymentMethod } from 'src/common/enums/unit.enum';
import { OrderItemEntity } from './order_item.entity';
import { CartItemEntity } from './cart_item.entity';


@ObjectType() // cho GraphQL
@Entity('cart') // tên bảng trong DB
// @SearchFields(['name'])
export class CartEntity extends BaseEntity {
     @OneToOne(() => UserEntity, user => user.cart, { eager: false })
     @JoinColumn({ name: 'user_id' })
     user: UserEntity;

     @OneToMany(() => CartItemEntity, orderItem => orderItem.cart)
     cart_item: CartItemEntity[];
}