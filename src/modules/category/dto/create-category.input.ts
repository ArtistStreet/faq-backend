// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
     @Field()
     name: string;

     @Field({ nullable: true })
     description?: string;

     @Field(() => [Number], { nullable: true })
     productIds?: number[];
}