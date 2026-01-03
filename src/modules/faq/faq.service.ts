import { Injectable } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from 'src/entities/faq.entity';
import { Repository } from 'typeorm';
import { CreateFaqInput, UpdateFaqInput } from './dto/create-faq.input';

@Injectable()
export class FaqService {
     constructor(
          @InjectRepository(Faq)
          private readonly faqRepository: Repository<Faq>,
     ) { }

     async findAll(): Promise<Faq[]> {
          return this.faqRepository.find({
               // order: { question: 'ASC' },
          });
     }

     async create(input: CreateFaqInput): Promise<Faq> {
          const faq = this.faqRepository.create({
               question: input.question,
               answer: input.answer,
               categories: input.categories || [],
               group: input.group_id ? { id: input.group_id } as any : null,
          });

          return this.faqRepository.save(faq);
     }

     async update(id: number, input: UpdateFaqInput): Promise<Faq> {
          const faq = await this.faqRepository.findOneOrFail({
               where: { id },
          });

          if (input.question !== undefined) faq.question = input.question;
          if (input.answer !== undefined) faq.answer = input.answer;
          if (input.categories !== undefined) faq.categories = input.categories;
          if (input.group_id !== undefined) {
               faq.group = input.group_id ? { id: input.group_id } as any : null;
          }

          return this.faqRepository.save(faq);
     }

     async delete(id: number): Promise<void> {
          await this.faqRepository.delete(id);
     }
}
