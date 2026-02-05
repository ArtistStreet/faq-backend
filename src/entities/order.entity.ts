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
import { ShippingEntity } from './shipping.entity';


@ObjectType() // cho GraphQL
@Entity('order') // tên bảng trong DB
@SearchFields(['name'])
export class OrderEntity extends BaseEntity {
     @Field()
     @Column('text')
     desc: string;

     @Field()
     @Column('decimal', {
          precision: 10,
          scale: 2,
          transformer: {
               to: (value: number) => value,
               from: (value: string) => Number(value), // hoặc parseFloat(value)
          },
     })
     total_price: number;

     @Field()
     @Column()
     payment_method: PaymentMethod;

     @Field()
     @Column()
     status: OrderStatus;

     @Field()
     @Column()
     phone_number: string;

     @Field()
     @Column()
     address: string;

     @ManyToOne(() => UserEntity, { eager: false })
     @JoinColumn({ name: 'buyer_id' })
     buyer: UserEntity;

     @OneToMany(() => OrderItemEntity, orderItem => orderItem.order)
     order_item: OrderItemEntity[];

     @OneToOne(() => ShippingEntity, shipping => shipping.order)
     shipping: ShippingEntity;
}