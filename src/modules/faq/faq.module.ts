import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqResolver } from './faq.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from 'src/entities/faq.entity';

@Module({
     imports: [
          TypeOrmModule.forFeature([Faq]), // ← DÒNG QUAN TRỌNG NHẤT – ĐĂNG KÝ ENTITY FAQ
     ],
     providers: [FaqService, FaqResolver]
})
export class FaqModule { }
