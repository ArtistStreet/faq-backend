// entities/faq.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GroupEntity } from './group.entity';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from 'src/common/bases/base.entity';
import { Decimal128 } from 'typeorm/browser';
import { UserEntity } from './user.entity';
import { OrderStatus, PaymentMethod, Status } from 'src/common/enums/unit.enum';
import { OrderEntity } from './order.entity';


@ObjectType() // cho GraphQL
@Entity('orderItem') // tên bảng trong DB
// @SearchFields(['name'])
export class OrderItemEntity extends BaseEntity {
     @Field()
     @Column('decimal', {
          precision: 10,
          scale: 2,
          transformer: {
               to: (value: number) => value,
               from: (value: string) => Number(value), // hoặc parseFloat(value)
          },
     })
     price: number;

     @Field()
     @Column()
     quantity: number;

     @Field()
     @Column()
     status: Status;

     @ManyToOne(() => OrderEntity, { eager: false })
     @JoinColumn({ name: 'order_id' })
     order: OrderEntity;
}