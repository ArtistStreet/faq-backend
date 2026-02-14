import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLoaderService } from './data-loaders.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Global()
@Module({
     // imports: [TypeOrmModule.forFeature([])],
     imports: [
          AuthModule,  // 👈 THÊM CÁI NÀY
     ],
     providers: [DataLoaderService],
     exports: [DataLoaderService],
})
export class DataLoaderModule { }
