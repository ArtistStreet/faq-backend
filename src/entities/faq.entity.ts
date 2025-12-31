import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Group } from './group.entity';

@ObjectType()
@Entity('faqs')
export class Faq {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  question: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  answer: string;

  @Field(() => Group)
  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
