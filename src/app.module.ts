import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GroupModule } from './modules/group/group.module';
import { join } from 'path';
import { FaqModule } from './modules/faq/faq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // hoặc 'mysql', 'sqlite', ...
      host: 'localhost',
      port: 5432,
      username: 'dang', // thay bằng username thật của bạn
      password: 'ly', // thay bằng password thật
      database: 'db', // thay bằng tên database thật
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // cách tốt nhất: tự động load tất cả entity
      // hoặc nếu chỉ có ít entity: entities: [Group, Faq, ...],
      synchronize: true, // CHỈ dùng true ở môi trường dev/test
      // logging: true,           // bật để xem SQL query (dev only)
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    GroupModule,
    FaqModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
