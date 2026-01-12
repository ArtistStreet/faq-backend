import { PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseIdEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;
}
