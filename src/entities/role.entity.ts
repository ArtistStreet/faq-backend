// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RoleEntity {
     @Field(() => Int)
     @PrimaryGeneratedColumn()
     id: number;

     @Field()
     @Column()
     name: string;

     // Quan hệ ngược với Group
     // @Field(() => [Group], { nullable: true })
     // @ManyToMany(() => Group, (group) => group.roles, {
     //      onDelete: 'CASCADE'
     // })
     // groups?: Group[];

     @Field({ nullable: true })
     @Column({ nullable: true })
     description?: string;
}