// entities/faq.entity.ts
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';
import { UserEntity } from './user.entity';
import { CartItemEntity } from './cart_item.entity';


@ObjectType() // cho GraphQL
@Entity('cart') // tên bảng trong DB
// @SearchFields(['name'])
export class CartEntity extends BaseEntity {
     @OneToOne(() => UserEntity, user => user.cart, { eager: false })
     @JoinColumn({ name: 'user_id' })
     user: UserEntity;

     @Field(() => [CartItemEntity])
     @OneToMany(() => CartItemEntity, orderItem => orderItem.cart)
     cart_item: CartItemEntity[];
}