// dto/create-faq.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { FaqEntity } from 'src/entities/faq.entity';
import { ProductEntity } from 'src/entities/product.entity';

@InputType()
export class CreateCategoryInput {
     @Field()
     name: string;

     @Field({ nullable: true })
     description?: string;

     @Field({ nullable: true })
     product?: ProductEntity[];
}

// dto/update-faq.input.ts
@InputType()
export class UpdateCategoryInput {
     @Field({ nullable: true })
     name?: string;

     @Field({ nullable: true })
     description?: string;

     @Field({ nullable: true })
     product?: ProductEntity[];
}