import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from 'src/entities/role.entity';
// import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

@InputType()
export class CreateGroupInput {
     @Field()
     name: string; // bắt buộc khi tạo

     @Field({ nullable: true })
     description?: string;

     @Field(() => Int, { nullable: true })
     parent_id?: number;

     @Field(() => [Int], { nullable: true })
     roleIds?: number[];
}

@InputType()
export class UpdateGroupInput {
     @Field({ nullable: true })
     name?: string;

     @Field({ nullable: true })
     description?: string;

     @Field(() => Int, { nullable: true })
     parent_id?: number;

     @Field(() => [Int], { nullable: true })
     // @IsOptional()
     // @IsArray()
     roleIds?: number[];

     @Field(() => [String], { nullable: true })
     // @IsOptional()
     // @IsArray()
     faq?: number[];
}
