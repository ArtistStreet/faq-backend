// entities/faq.entity.ts
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';
import { OrderStatus, PaymentMethod } from 'src/common/enums/unit.enum';
import { OrderEntity } from './order.entity';


@ObjectType() // cho GraphQL
@Entity('shipping') // tên bảng trong DB
// @SearchFields(['name'])
export class ShippingEntity extends BaseEntity {
     @Field()
     @Column()
     full_name: string;

     @Field()
     @Column()
     phone: string;

     @Field()
     @Column()
     address: string;

     @Field(() => OrderStatus)
     @Column({
          type: 'enum',
          enum: OrderStatus,
          default: OrderStatus.PENDING
     })
     statud: OrderStatus;

     @OneToOne(() => OrderEntity, order => order.shipping)
     @JoinColumn({ name: 'order_id' })
     order: OrderEntity;
}