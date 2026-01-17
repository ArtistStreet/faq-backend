// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { FaqEntity } from 'src/entities/faq.entity';

@InputType()
export class CreateCategoryInput {
     @Field()
     name: string;

     @Field({ nullable: true })
     description?: string;
}

// dto/update-faq.input.ts
@InputType()
export class UpdateCategoryInput {
     @Field({ nullable: true })
     name?: string;

     @Field({ nullable: true })
     description?: string;
}