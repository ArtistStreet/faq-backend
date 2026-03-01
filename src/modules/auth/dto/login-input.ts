import { InputType, Field } from "@nestjs/graphql";
import { AddressEntity } from "src/entities/address.entity";

@InputType()
export class RegisterInput {
     @Field()
     name: string;

     @Field()
     email: string;

     @Field()
     password: string;

     // @Field({ nullable: true })
     // role?: number;
}

@InputType()
export class UpdateUserInput {

     @Field({ nullable: true })
     name?: string;

     @Field({ nullable: true })
     phone_number?: string;

     @Field({ nullable: true })
     email?: string;

     // @Field(() => [AddressEntity], { nullable: true })
     // addresses?: AddressEntity[];

}

@InputType()
export class LoginInput {
     @Field()
     email: string;

     @Field()
     password: string;
}
