import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Group } from '../../entities/group.entity';
import { GroupService } from './group.service';
import { UpdateGroupInput } from './dto/update-group.input';

// Resolver này sẽ xử lý các query, mutation, field liên quan đến object Group trong schema GraphQL.
@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

  // list ra toan bo group
  @Query(() => [Group])
  groups() {
    return this.groupService.findAll();
  }

  // tao moi
  @Mutation(() => Group)
  async createGroup(
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('parent_id', { type: () => Int, nullable: true }) parent_id?: number, // ep kieu int
  ) {
    return this.groupService.create(name, description, parent_id);
  }

  // sua
  @Mutation(() => Group)
  async updateGroup(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateGroupInput,
  ) {
    return this.groupService.update(id, input);
  }

  // xoa
  @Mutation(() => Boolean)
  async deleteGroup(@Args('id', { type: () => Int }) id: number) {
    await this.groupService.delete(id);
    return true;
  }
}
