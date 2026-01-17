import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { FaqEntity } from 'src/entities/faq.entity';
import { CreateFaqInput, UpdateFaqInput } from './dto/create-faq.input';
import { FaqModel } from './models/faq.model';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { IPaginatedType } from 'src/common/bases/base.model';

@Resolver()
export class FaqResolver {
     constructor(private readonly faqService: FaqService) { }

     @Query(() => FaqModel)
     async faqList(@Args('input') body: BasePaginationInput): Promise<IPaginatedType<FaqEntity>> {
          return this.faqService.search(body);
     }

     @Mutation(() => FaqEntity)
     async createFaq(@Args('input') input: CreateFaqInput): Promise<FaqEntity> {
          return this.faqService.createWithCategories(input);
     }

     @Mutation(() => FaqEntity)
     async updateFaq(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: UpdateFaqInput,
     ): Promise<FaqEntity> {
          return this.faqService.updateOne(id, input);
     }

     @Mutation(() => Boolean)
     async deleteFaq(@Args('id', { type: () => Int }) id: number) {
          await this.faqService.softDelete(id);
          return true;
     }
}
