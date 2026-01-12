import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
     totalCount: number;
     totalPages: number;
     currentPage: number;
     data: T[];
}

export function BasePaginatedModel<T>(classRef: new () => T) {
     @ObjectType({ isAbstract: true })
     abstract class PaginatedType {
          @Field(() => Int)
          totalCount: number;

          @Field(() => Int)
          totalPages: number;

          @Field(() => Int)
          currentPage: number;

          @Field(() => [classRef])
          data: T[];
     }
     return PaginatedType;
}
