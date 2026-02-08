import { ObjectType } from '@nestjs/graphql';
import { BasePaginatedModel } from 'src/common/bases/base.model';
import { UserEntity } from 'src/entities/user.entity';

@ObjectType()
export class UserModel extends BasePaginatedModel(UserEntity) { }
