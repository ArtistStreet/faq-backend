// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Group } from './group.entity';

@ObjectType()
@Entity()
export class Role {
     @Field(() => Int)
     @PrimaryGeneratedColumn()
     id: number;

     @Field()
     @Column()
     name: string;

     // Quan hệ ngược với Group
     @Field(() => [Group], { nullable: true })
     @ManyToMany(() => Group, (group) => group.roles)
     groups?: Group[];
}