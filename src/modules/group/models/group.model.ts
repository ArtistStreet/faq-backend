import { ObjectType } from '@nestjs/graphql';
import { BasePaginatedModel } from 'src/common/bases/base.model';
import { GroupEntity } from 'src/entities/group.entity';

@ObjectType()
export class GroupModel extends BasePaginatedModel(GroupEntity) { }
