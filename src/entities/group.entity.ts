import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@ObjectType()
@Entity('groups')
export class Group {
  @Field(() => Int) // tao ra truong id tang tu dong (graphql)
  @PrimaryGeneratedColumn() // (orm)
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true }) // truong ten
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true }) // truong mo ta
  description?: string;

  @Field(() => Int, { nullable: true }) // truong phong ban cha
  @Column({ nullable: true })
  parent_id?: number;

  @ManyToOne(() => Group, (g) => g.children, { onDelete: 'CASCADE' }) // nhieu con co 1 cha, xoa cha thi xoa luon con
  @JoinColumn({ name: 'parent_id' }) // parentid la fk
  parent: Group;

  @OneToMany(() => Group, (g) => g.parent)
  children: Group[];
}
