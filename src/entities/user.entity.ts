// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';
import { ProductEntity } from './product.entity';

@ObjectType()
@Entity()
@SearchFields(['name'])
export class UserEntity extends BaseEntity {
     @Field()
     @Column({ nullable: true })
     name: string;

     @Field()
     @Column({ unique: true })
     email: string;

     @Column()
     password: string;

     @Field()
     @Column({ default: 1 })
     role: number;

     @Field()
     @Column({ nullable: true })
     address: string;

     @Field()
     @Column({ unique: true, nullable: true })
     phone_number: string;

     @Column({ type: 'varchar', nullable: true })
     resetPasswordToken?: string | null;

     @Column({ type: 'timestamp', nullable: true })
     resetPasswordExpires?: Date | null;

     @OneToMany(() => ProductEntity, product => product.seller)
     product: ProductEntity[];
}