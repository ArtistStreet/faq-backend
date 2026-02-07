// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { FaqEntity } from 'src/entities/faq.entity';

@InputType()
export class CreateShopInput {
     @Field()
     name: string;

     @Field({ nullable: true })
     desc?: string;

     @Field()
     address: string;
}