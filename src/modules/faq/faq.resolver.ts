import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { FaqEntity } from 'src/entities/faq.entity';
import { CreateFaqInput, UpdateFaqInput } from './dto/create-faq.input';
import { FaqModel } from './models/faq.model';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { IPaginatedType } from 'src/common/bases/base.model';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUser } from '../auth/auth.decorator';
import { UserEntity } from 'src/entities/user.entity';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class FaqResolver {
     constructor(private readonly faqService: FaqService) { }

     @Query(() => FaqModel)
     async faqList(@Args('input') body: BasePaginationInput): Promise<IPaginatedType<FaqEntity>> {
          return this.faqService.search(body);
     }

     @Roles(Role.ADMIN)
     @Mutation(() => FaqEntity)
     async createFaq(@Args('input') input: CreateFaqInput, @AuthUser() auth: UserEntity): Promise<FaqEntity> {
          return this.faqService.create({ ...input, created_by: auth.id });
     }

     @Mutation(() => FaqEntity)
     async updateFaq(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: UpdateFaqInput,
          @AuthUser() auth: UserEntity
     ): Promise<FaqEntity> {
          return this.faqService.updateOne(id, { ...input, updated_by: auth.id });
     }

     @Mutation(() => Boolean)
     async deleteFaq(@Args('id', { type: () => Int }) id: number, @AuthUser() auth: UserEntity) {
          await this.faqService.softDelete(id, auth.id);
          return true;
     }
}
