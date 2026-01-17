import { ObjectType } from '@nestjs/graphql';
import { BasePaginatedModel } from 'src/common/bases/base.model';
import { FaqEntity } from 'src/entities/faq.entity';

@ObjectType()
export class FaqModel extends BasePaginatedModel(FaqEntity) { }
