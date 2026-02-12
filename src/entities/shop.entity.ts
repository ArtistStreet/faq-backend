// entities/faq.entity.ts
import { Entity, Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';


@ObjectType() // cho GraphQL
@Entity('shop') // tên bảng trong DB
// @SearchFields(['name'])
export class ShopEntity extends BaseEntity {
     @Field({ nullable: true })
     @Column({ nullable: true })
     desc?: string;

     @Field()
     @Column()
     name: string;

     @Field()
     @Column()
     address: string;

     @Field({ nullable: true })
     @Column({ nullable: true })
     rating?: number;

     @OneToOne(() => UserEntity, user => user.shop, { eager: false })
     @JoinColumn({ name: 'owner_id' })
     owner: UserEntity;

     @OneToMany(() => ProductEntity, product => product.shop)
     product?: ProductEntity[];
}