import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as momentTimeZone from 'moment-timezone';

const configService = new ConfigService();

async function bootstrap() {
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
  const RABBITMQ_QUEUE = configService.get<string>('CHALLENGE_QUEUE');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        noAck: false,
        queue: RABBITMQ_QUEUE,
      },
    },
  );

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();
}
bootstrap();
