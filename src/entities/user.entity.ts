// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { ShopEntity } from './shop.entity';
import { Role } from 'src/common/enums/role.enum';
import { CartEntity } from './cart.entity';
import { AddressEntity } from './address.entity';

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
     role: Role;

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
     product?: ProductEntity[];

     @OneToMany(() => OrderEntity, order => order.buyer)
     order?: OrderEntity[];

     @OneToOne(() => ShopEntity, shop => shop.owner)
     shop?: ShopEntity;

     @OneToOne(() => CartEntity, cart => cart.user)
     cart?: CartEntity;

     @OneToMany(() => AddressEntity, address => address.user)
     addresses?: AddressEntity[];
}