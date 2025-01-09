import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin123@localhost:5672/smartranking'],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  await app.listen();
}
bootstrap();
