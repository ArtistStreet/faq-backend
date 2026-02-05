// entities/faq.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GroupEntity } from './group.entity';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from 'src/common/bases/base.entity';
import { Decimal128 } from 'typeorm/browser';
import { UserEntity } from './user.entity';
import { OrderStatus, PaymentMethod } from 'src/common/enums/unit.enum';
import { OrderItemEntity } from './order_item.entity';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';


@ObjectType() // cho GraphQL
@Entity('cart_item') // tên bảng trong DB
// @SearchFields(['name'])
export class CartItemEntity extends BaseEntity {
     @Field()
     @Column()
     quantity: number;

     @ManyToOne(() => CartEntity, cart => cart.cart_item, { eager: false })
     @JoinColumn({ name: 'cart_id' })
     cart: CartEntity;

     @ManyToOne(() => ProductEntity, { eager: true })
     @JoinColumn({ name: 'product_id' })
     product: ProductEntity;
}