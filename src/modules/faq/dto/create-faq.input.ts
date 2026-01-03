// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateFaqInput {
     @Field()
     question: string;

     @Field()
     answer: string;

     @Field(() => [String], { nullable: true })
     categories?: string[];

     @Field(() => Int, { nullable: true })
     group_id?: number;
}

// dto/update-faq.input.ts
@InputType()
export class UpdateFaqInput {
     @Field({ nullable: true })
     question?: string;

     @Field({ nullable: true })
     answer?: string;

     @Field(() => [String], { nullable: true })
     categories?: string[];

     @Field(() => Int, { nullable: true })
     group_id?: number;
}