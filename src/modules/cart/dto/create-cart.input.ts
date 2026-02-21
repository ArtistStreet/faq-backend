// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { ProductStatus } from 'src/common/enums/unit.enum';
import { registerEnumType } from '@nestjs/graphql';

@InputType()
export class CreateCartInput {
     @Field()
     name: string;

     @Field({ nullable: true })
     desc?: string;

     @Field()
     price: number;

     @Field()
     stock: number;

     @Field(() => [Int])
     categoryIds: number[];

     // @Field(() => [String])
     // images: string[];

     @Field(() => ProductStatus, { nullable: true })
     status: ProductStatus;
}