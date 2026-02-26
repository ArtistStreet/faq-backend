// entities/faq.entity.ts
import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/bases/base.entity';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';


@ObjectType()
@Entity('cart_item')
@Unique(['cart', 'product'])
// @SearchFields(['name'])
export class CartItemEntity extends BaseEntity {
     @Field()
     @Column()
     quantity: number;

     @ManyToOne(() => CartEntity, cart => cart.cart_item, { eager: false })
     @JoinColumn({ name: 'cart_id' })
     cart: CartEntity;

     @Field(() => ProductEntity)
     @ManyToOne(() => ProductEntity, { eager: true })
     @JoinColumn({ name: 'product_id' })
     product: ProductEntity;
}