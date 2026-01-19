// entities/group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, BaseEntity, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FaqEntity } from './faq.entity';
import { RoleName } from 'src/common/enums/role.enum';
import { SearchFields } from 'src/common/decorators/entity.decorators';

@ObjectType()
@Entity()
@SearchFields(['name', 'description'])
export class GroupEntity extends BaseEntity {
     @Field(() => Int)
     @PrimaryGeneratedColumn()
     id: number;

     @Field()
     @Column()
     name: string;

     @Field({ nullable: true })
     @Column({ nullable: true })
     description?: string;

     @Field(() => Int, { nullable: true })
     @Column({ nullable: true })
     parent_id?: number;

     @Field(() => GroupEntity, { nullable: true })
     @ManyToOne(() => GroupEntity, (g) => g.children, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'parent_id' })
     parent?: GroupEntity;

     @Field(() => [GroupEntity], { nullable: true })
     @OneToMany(() => GroupEntity, (g) => g.parent)
     children?: GroupEntity[];

     @Field(() => Boolean, { nullable: true })
     hasChildren?: boolean; // field ảo, không lưu DB

     @Column({ type: 'smallint' })
     @Field(() => Int)
     role: RoleName;

     @DeleteDateColumn({ name: 'deleted_at' })
     deletedAt?: Date;

     // @Field(() => [FaqEntity], { nullable: true })
     // @OneToMany(() => FaqEntity, (faq) => faq.group, {
     //      nullable: true,
     //      onDelete: 'SET NULL', // nếu xóa group thì faq.group = null
     //      cascade: true,        // tùy chọn: tự save faq khi save group
     // })
     // faqs?: FaqEntity[];
}