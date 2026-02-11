import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { SearchFields } from 'src/common/decorators/entity.decorators';
import { BaseEntity } from 'src/common/bases/base.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { ShopEntity } from './shop.entity';
import { Role } from 'src/common/enums/role.enum';
import { CartEntity } from './cart.entity';
import { AddressEntity } from './address.entity';

registerEnumType(Role, {
     name: 'Role',
     description: 'User roles'
});

@ObjectType()
@Entity()
@SearchFields(['name'])
export class UserEntity extends BaseEntity {
     @Field({ nullable: true })
     @Column({ nullable: true })
     name: string;

     @Field()
     @Column({ unique: true })
     email: string;

     @Column()
     password: string;

     @Field(() => Role)
     @Column({
          type: 'enum',
          enum: Role,
          default: Role.USER
     })
     role: Role;

     @Field({ nullable: true })
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

     @Field(() => ShopEntity, { nullable: true })
     @OneToOne(() => ShopEntity, shop => shop.owner)
     shop?: ShopEntity;

     @OneToOne(() => CartEntity, cart => cart.user)
     cart?: CartEntity;

     @OneToMany(() => AddressEntity, address => address.user)
     addresses?: AddressEntity[];
}