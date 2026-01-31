// entities/faq.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GroupEntity } from './group.entity';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from 'src/common/bases/base.entity';


@ObjectType() // cho GraphQL
@Entity('faqs') // tên bảng trong DB
@SearchFields(['question', 'answer'])
export class FaqEntity extends BaseEntity {
     @Field()
     @Column()
     question: string;

     @Field()
     @Column('text')
     answer: string;

     @Field(() => [CategoryEntity], { nullable: true })
     @ManyToMany(() => CategoryEntity, category => category.faq)
     @JoinTable({
          name: 'faq_category', // tao ten bang trung gian
          joinColumn: {
               name: 'faq_id',
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

     // Quan hệ với GroupEntity
     // @Field(() => GroupEntity, { nullable: true })
     // @ManyToOne(() => GroupEntity, (group) => group.faqs, { nullable: true, onDelete: 'SET NULL' })
     // @JoinColumn({ name: 'group_id' })
     // group?: GroupEntity;

     // // Cột group_id trong DB (không cần @Field vì đã có group)
     // @Field()
     // @Column({ name: 'group_id', nullable: true })
     // group_id?: number;

}