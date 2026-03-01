import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from 'src/common/bases/base.entity';
import { UserEntity } from "./user.entity";

@ObjectType()
@Entity('addresses')
export class AddressEntity extends BaseEntity {
     // @Field()
     // @Column()
     // province: string;

     // @Field()
     // @Column()
     // district: string;

     // @Field()
     // @Column()
     // ward: string;

     @Field()
     @Column()
     address_line: string; // số nhà, tên đường

     @Field({ nullable: true })
     @Column({ default: false })
     is_default: boolean;

     @ManyToOne(() => UserEntity, user => user.addresses)
     @JoinColumn({ name: 'user_id' })
     user: UserEntity;
}
