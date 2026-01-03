// entities/group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from './role.entity';
import { Faq } from './faq.entity';

@ObjectType()
@Entity()
export class Group {
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

     @Field(() => Group, { nullable: true })
     @ManyToOne(() => Group, (g) => g.children, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'parent_id' })
     parent?: Group;

     @Field(() => [Group], { nullable: true })
     @OneToMany(() => Group, (g) => g.parent)
     children?: Group[];

     @Field(() => Boolean, { nullable: true })
     hasChildren?: boolean; // field ảo, không lưu DB

     // QUAN HỆ NHIỀU-NHIỀU VỚI ROLE – ĐÚNG CÁCH
     @Field(() => [Role], { nullable: true })
     @ManyToMany(() => Role, (role) => role.groups)
     @JoinTable({
          name: 'group_role', // tên bảng trung gian
          joinColumn: { name: 'group_id', referencedColumnName: 'id' },
          inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
     })
     roles?: Role[];

     @Field(() => [Faq], { nullable: true })
     @OneToMany(() => Faq, (faq) => faq.group, {
          nullable: true,
          onDelete: 'SET NULL', // nếu xóa group thì faq.group = null
          cascade: true,        // tùy chọn: tự save faq khi save group
     })
     faqs?: Faq[];
}