import { Injectable } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from 'src/entities/faq.entity';
import { Repository } from 'typeorm';
import { CreateFaqInput, UpdateFaqInput } from './dto/create-faq.input';

interface FindAllOptions {
     search?: string;
     group_id?: number;
}

@Injectable()
export class FaqService {
     constructor(
          @InjectRepository(Faq)
          private readonly faqRepository: Repository<Faq>,
     ) { }

     async findAll(options: FindAllOptions = {}): Promise<Faq[]> {
          const qb = this.faqRepository.createQueryBuilder('faq');

          if (options.group_id) {
               qb.andWhere('faq.group_id = :group_id', { group_id: options.group_id });
          }

          if (options.search) {
               const searchTerm = `%${options.search.trim()}%`;
               qb.andWhere(
                    '(faq.question ILIKE :search OR faq.answer ILIKE :search)',
                    { search: searchTerm }
               );
          }

          return qb.orderBy('faq.id', 'DESC').getMany();
     }

     async create(input: CreateFaqInput): Promise<Faq> {
          const faq = this.faqRepository.create({
               question: input.question,
               answer: input.answer,
               categories: input.categories,
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
