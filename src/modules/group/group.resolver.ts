import { Resolver, Query } from '@nestjs/graphql';
import { Group } from '../../entities/group.entity';

@Resolver(() => Group)
export class GroupResolver {
  @Query(() => String)
  hello() {
    return 'GraphQL is working';
  }
}
