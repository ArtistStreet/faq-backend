import { Field, HideField, InputType, Int } from '@nestjs/graphql';
import appConf from '../../configs/app.conf';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class BaseInput {
     @Field(() => String, { nullable: true })
     @IsOptional()
     @IsString()
     search?: string;

     @Field(() => [String], {
          nullable: true,
          description: `Filter format: key:operator(value). Supported operators:\n
    - "="  → Equal (e.g., status:=(active))\n 
    - "!=" → Not Equal (e.g., role:!=(admin))\n 
    - ">"  → Greater Than (e.g., price:>(100))\n 
    - "<"  → Less Than (e.g., age:<(30))\n 
    - ">=" → Greater Than or Equal (e.g., rating:>=(4.5))\n 
    - "<=" → Less Than or Equal (e.g., discount:<=(20))\n 
    - "~"  → LIKE (e.g., name:~(John)) (case-insensitive search)\n 
    - "!~" → NOT LIKE (e.g., description:!~(test))\n 
    - "[]" → IN (e.g., category:[](electronics,clothing))\n 
    - "![]" → NOT IN (e.g., tag:![](sale,new))`,
     })
     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     filters?: string[];

     @Field(() => String, {
          nullable: true,
          description: `Sorting format: "field:direction"\n
    - \`field\`: The column name to sort by (e.g., "name", "created_at").\n
    - \`direction\`: Sorting order, either "ASC" (ascending) or "DESC" (descending).\n
    Examples:\n
    - "name:ASC"        → Sort by \`name\` in ascending order.\n
    - "created_at:DESC" → Sort by \`created_at\` in descending order.\n
    - "price:ASC"       → Sort by \`price\` in ascending order.`,
     })
     @IsOptional()
     @IsString()
     sort?: string;
}

@InputType()
export class BasePaginationInput extends BaseInput {
     @Field(() => Int, { defaultValue: 1 })
     @IsInt()
     @Min(1)
     page: number;

     @Field(() => Int, { defaultValue: appConf.PAGE_DEFAULT })
     @IsInt()
     @Min(1)
     limit: number;
}

@InputType()
export class BaseUpdateInputDto {
     @IsOptional()
     @HideField()
     id?: number;
}
