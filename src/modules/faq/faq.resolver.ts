import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { Faq } from 'src/entities/faq.entity';
import { CreateFaqInput, UpdateFaqInput } from './dto/create-faq.input';

@Resolver()
export class FaqResolver {
     constructor(private readonly faqService: FaqService) { }

     // list ra toan bo group(khong toi uu neu nhieu)
     @Query(() => [Faq])
     faqList() {
          return this.faqService.findAll();
     }

     @Mutation(() => Faq)
     async createFaq(@Args('input') input: CreateFaqInput) {
          return this.faqService.create(input);
     }

     // UPDATE FAQ
     @Mutation(() => Faq)
     async updateFaq(
          @Args('id', { type: () => Int }) id: number,
          @Args('input') input: UpdateFaqInput,
     ) {
          return this.faqService.update(id, input);
     }

     // xoa
     @Mutation(() => Boolean)
     async deleteFaq(@Args('id', { type: () => Int }) id: number) {
          await this.faqService.delete(id);
          return true;
     }
}
