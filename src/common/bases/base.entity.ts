import { Column, CreateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from './base-id.entity';

@ObjectType()
export class BaseEntity extends BaseIdEntity {
     @Column({ nullable: true })
     @Field({ nullable: true })
     created_by?: number;

     @Column({ nullable: true })
     @Field({ nullable: true })
     updated_by?: number;

     @Column({ nullable: true })
     deleted_by?: number;

     @CreateDateColumn({ type: 'timestamptz' })
     @Field(() => GraphQLISODateTime)
     created_at?: Date;

     @UpdateDateColumn({ type: 'timestamptz', nullable: true })
     @Field(() => String, { nullable: true })
     updated_at?: Date;

     @DeleteDateColumn({ type: 'timestamptz', nullable: true })
     deleted_at?: Date;

     @ManyToOne('UserEntity', { onDelete: 'RESTRICT' })
     @JoinColumn({ name: 'created_by' })
     @Field(() => UserEntity)
     createdByUser?: any;

     @ManyToOne('UserEntity', { nullable: true, onDelete: 'RESTRICT' })
     @JoinColumn({ name: 'updated_by' })
     @Field(() => UserEntity, { nullable: true })
     updatedByUser?: any;

     @ManyToOne('UserEntity', { nullable: true, onDelete: 'RESTRICT' })
     @JoinColumn({ name: 'deleted_by' })
     deletedByUser?: any;
}
import { UserEntity } from '../../entities/user.entity';
