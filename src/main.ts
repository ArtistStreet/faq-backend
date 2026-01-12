import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RoleSeeder } from './seeds/role.seeder';
// import { DataSource } from 'typeorm';

async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.enableCors({
          origin: 'http://localhost:5173', // cho phép frontend Vite truy cập
          credentials: true,
     });
     await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
