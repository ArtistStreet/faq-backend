// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';

@ObjectType()
@Entity()
@SearchFields(['name'])
export class UserEntity extends BaseEntity {
     // @Field()
     // @Column()
     // name: string;

     @Field()
     @Column({ unique: true })
     email: string;

     @Column()
     password: string;

     @Field()
     @Column({ default: 1 })
     role: number;
}