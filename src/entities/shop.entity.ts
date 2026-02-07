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


@ObjectType() // cho GraphQL
@Entity('shop') // tên bảng trong DB
// @SearchFields(['name'])
export class ShopEntity extends BaseEntity {
     @Field()
     @Column('text')
     desc: string;

     @Field()
     @Column()
     name: string;

     @Field()
     @Column()
     address: string;

     @Field()
     @Column()
     rating?: string;

     @OneToOne(() => UserEntity, { eager: false })
     @JoinColumn({ name: 'owner_id' })
     owner: UserEntity;

     @OneToMany(() => ProductEntity, product => product.shop)
     product?: ProductEntity[];
}