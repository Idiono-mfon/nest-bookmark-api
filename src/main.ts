import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ensure validations checks are enforced globally
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  // whitelist: true, checks our DTO(data transfer object) and strips in other fields in our body
  // that is not required or specified in our DTO definiition.
  await app.listen(5000);
}
bootstrap();
