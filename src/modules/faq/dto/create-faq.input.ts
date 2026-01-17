// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateFaqInput {
     @Field()
     question: string;

     @Field()
     answer: string;

     @Field(() => [Int], { nullable: true })
     categoryIds: number[];

     // @Field(() => Int, { nullable: true })
     // group_id?: number;
}

@InputType()
export class UpdateFaqInput {
     @Field({ nullable: true })
     question?: string;

     @Field({ nullable: true })
     answer?: string;

     @Field(() => [Int], { nullable: true })
     categoryIds?: number[];

     // @Field(() => Int, { nullable: true })
     // group_id?: number;
}