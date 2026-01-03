import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { Group } from '../../entities/group.entity';
import { GroupService } from './group.service';
import { CreateGroupInput, UpdateGroupInput } from './dto/update-group.input';

// Resolver này sẽ xử lý các query, mutation, field liên quan đến object Group trong schema GraphQL.
// goi tu service
@Resolver(() => Group)
export class GroupResolver {
     constructor(private readonly groupService: GroupService) { }

     @Query(() => [Group])
     rootGroups() {
          return this.groupService.findRootGroups();
     }

     @Query(() => [Group])
     groupChildren(@Args('parentId', { type: () => Int }) parentId: number) {
          return this.groupService.findChildren(parentId);
     }

     // list ra toan bo group(khong toi uu neu nhieu)
     @Query(() => [Group])
     groupList() {
          return this.groupService.findAll();
     }

     @ResolveField(() => Boolean)
     async hasChildren(@Parent() group: Group) {
          const count = await this.groupService.countChildren(group.id);
          return count > 0;
     }

     // tao moi
     @Mutation(() => Group)
     async createGroup(
          @Args('input') input: CreateGroupInput,
     ) {
          const group = await this.groupService.create(input);

          // Load full roles để có name
          return this.groupService.findOneWithRoles(group.id);
     }

     // sua
     // group.resolver.ts
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
