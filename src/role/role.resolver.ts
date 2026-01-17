import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleEntity } from 'src/entities/role.entity';
import { RoleService } from './role.service';

@Resolver()
export class RoleResolver {
     constructor(private readonly roleService: RoleService) { }

     @Query(() => [RoleEntity])
     roleList() {
          return this.roleService.findAll();
     }

     @Mutation(() => RoleEntity)
     async createRole(
          @Args('name') name: string,
     ) {
          return this.roleService.create(name);
     }

     @Mutation(() => Boolean)
     async deleteRole(@Args('id', { type: () => Int }) id: number) {
          await this.roleService.delete(id);
          return true;
     }
}
