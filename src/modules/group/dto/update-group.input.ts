import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateGroupInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  parent_id?: number;
}
