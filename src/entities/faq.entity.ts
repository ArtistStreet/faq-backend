// entities/faq.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Group } from './group.entity';

@ObjectType() // cho GraphQL
@Entity('faqs') // tên bảng trong DB
export class Faq {
     @Field(() => Int)
     @PrimaryGeneratedColumn()
     id: number;

     @Field()
     @Column()
     question: string;

     @Field()
     @Column('text') // answer thường dài → dùng text thay vì varchar mặc định
     answer: string;

     // Nếu categories là nhiều danh mục (ví dụ: "Thanh toán, Giao hàng")
     // → Dùng simple-array hoặc ManyToMany
     // Cách 1: Lưu dạng chuỗi ngăn cách (đơn giản)
     @Field(() => [String], { nullable: true })
     @Column('simple-array', { nullable: true }) // lưu ["Thanh toán", "Giao hàng"]
     categories?: string[];

     // Cách 2: Nếu muốn quan hệ thật với entity Category → dùng ManyToMany (sau này)

     // Quan hệ với Group
     @Field(() => Group, { nullable: true })
     @ManyToOne(() => Group, (group) => group.faqs, { nullable: true, onDelete: 'SET NULL' })
     @JoinColumn({ name: 'group_id' })
     group?: Group;

     // Cột group_id trong DB (không cần @Field vì đã có group)
     @Field()
     @Column({ name: 'group_id', nullable: true })
     group_id?: number;
}