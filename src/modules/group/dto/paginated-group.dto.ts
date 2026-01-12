// dto/paginated-group.dto.ts
// import { Paginated } from 'src/base/pagination.input';
import { GroupEntity } from 'src/entities/group.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedGroup {
     @Field(() => [GroupEntity])
     items: GroupEntity[];

     @Field(() => Int)
     total: number;

     @Field(() => Int)
     page: number;

     @Field(() => Int)
     limit: number;
}