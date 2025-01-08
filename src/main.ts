import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { url } from 'inspector';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin123@localhost:5672/smartranking'],
      queue: 'admin-backend',
    },
  });

  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
