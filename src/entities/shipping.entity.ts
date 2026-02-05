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
import { ProductEntity } from './product.entity';
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