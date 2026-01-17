import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { GroupEntity } from '../../entities/group.entity';
import { GroupService } from './group.service';
import { CreateGroupInput, UpdateGroupInput } from './dto/update-group.input';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { IPaginatedType } from 'src/common/bases/base.model';
import { GroupModel } from './models/group.model';

// Resolver này sẽ xử lý các query, mutation, field liên quan đến object GroupEntity trong schema GraphQL.
// goi tu service
@Resolver(() => GroupEntity)
export class GroupResolver {
     constructor(private readonly groupService: GroupService) { }

     @Query(() => GroupModel) // kieu du lieu tra ve la groupmodel
     async rootGroups(@Args('input') body: BasePaginationInput): Promise<IPaginatedType<GroupEntity>> {
          return this.groupService.search(body);
     }

     @Query(() => GroupModel)
     async groupChildren(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') body: BasePaginationInput): Promise<IPaginatedType<GroupEntity>> {
          return this.groupService.findChildren(id, body);
     }

     // @ResolveField(() => Boolean)
     // async hasChildren(@Parent() group: GroupEntity) {
     //      const count = await this.groupService.countChildren(group.id);
     //      return count > 0;
     // }

     @Mutation(() => GroupEntity)
     async createGroup(@Args('input') body: CreateGroupInput): Promise<GroupEntity> {
          return this.groupService.create(body);
     }

     // sua
     @Mutation(() => GroupEntity)
     async updateGroup(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: UpdateGroupInput,
     ): Promise<GroupEntity> {
          return this.groupService.updateOne(id, input);
     }

     // xoa
     @Mutation(() => Boolean)
     async deleteGroup(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
          await this.groupService.softDelete(id);
          return true;
     }
}
