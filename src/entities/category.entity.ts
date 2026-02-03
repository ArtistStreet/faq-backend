// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FaqEntity } from './faq.entity';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { ProductEntity } from './product.entity';

@ObjectType()
@Entity()
@SearchFields(['name'])
export class CategoryEntity extends BaseEntity {
     @Field(() => Int)
     @PrimaryGeneratedColumn()
     id: number;

     @Field()
     @Column()
     name: string;

     @ManyToMany(() => FaqEntity, faq => faq.category)
     faq?: FaqEntity[]; // k phai cot trong db

     @ManyToMany(() => ProductEntity, faq => faq.category)
     product?: ProductEntity[]; // k phai cot trong db

     @Field({ nullable: true })
     @Column({ nullable: true })
     description?: string;

     @DeleteDateColumn({ name: 'deleted_at' })
     deletedAt?: Date;
}