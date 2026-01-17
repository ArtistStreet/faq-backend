import { Field, InputType, Int } from '@nestjs/graphql';
import { RoleName } from 'src/common/enums/role.enum';
// import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(RoleName, {
     name: 'RoleName',
});

@InputType()
export class CreateGroupInput {
     @Field()
     name: string; // bắt buộc khi tạo

     @Field({ nullable: true })
     description?: string;

     @Field(() => Int, { nullable: true })
     parent_id?: number;

     // @Field(() => [Int], { nullable: true })
     // roleIds?: number[];
     @Field(() => RoleName) // ← dùng enum
     role: RoleName;
}

@InputType()
export class UpdateGroupInput {
     @Field({ nullable: true })
     name?: string;

     @Field({ nullable: true })
     description?: string;

     @Field(() => Int, { nullable: true })
     parent_id?: number;

     @Field(() => RoleName) // ← dùng enum
     role: RoleName;

     @Field(() => [String], { nullable: true })
     // @IsOptional()
     // @IsArray()
     faq?: number[];
}
