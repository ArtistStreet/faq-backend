// entities/faq.entity.ts
import { Entity, Column, ManyToMany, JoinTable, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from 'src/common/bases/base.entity';
import { UserEntity } from './user.entity';
import { ProductStatus } from 'src/common/enums/unit.enum';
import { ShopEntity } from './shop.entity';
import { CartItemEntity } from './cart_item.entity';
import { OrderItemEntity } from './order_item.entity';

@ObjectType() // cho GraphQL
@Entity('product') // tên bảng trong DB
@SearchFields(['name'])
export class ProductEntity extends BaseEntity {
     @Field()
     @Column()
     name: string;

     @Field()
     @Column('text')
     desc?: string;

     @Field()
     @Column('decimal', { precision: 10, scale: 2 })
     price: number;

     @Field()
     @Column()
     stock: number;

     @ManyToOne(() => UserEntity, { eager: false })
     @JoinColumn({ name: 'seller_id' })
     seller: UserEntity;

     @Field(() => [CategoryEntity], { nullable: true })
     @ManyToMany(() => CategoryEntity, category => category.product)
     @JoinTable({
          name: 'product_category', // tao ten bang trung gian
          joinColumn: {
               name: 'product_id',
               referencedColumnName: 'id',
          },
          inverseJoinColumn: {
               name: 'category_id',
               referencedColumnName: 'id',
          },
     })
     // faq_category
     // faq_id(FK → faq.id)
     // category_id(FK → category.id)
     category: CategoryEntity[]; // khong phai cot trong db

     @Field({ nullable: true })
     @Column({ nullable: true })
     status: ProductStatus;

     @Field({ nullable: true })
     @ManyToOne(() => ShopEntity, { eager: false })
     @JoinColumn({ name: 'shop_id' })
     shop: ShopEntity;

     // @OneToMany(() => CartItemEntity, cart => cart.product)
     // cart: CartItemEntity[];
}