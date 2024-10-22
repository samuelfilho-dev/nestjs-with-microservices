import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ProxyProvider {
  private readonly RABBITMQ_URL =
    this.configService.get<string>('RABBITMQ_URL');

  constructor(private readonly configService: ConfigService) {}

  getClientProxyAdminBackendInstance(): ClientProxy {
    const QUEUE_NAME = this.configService.get<string>('ADMIN_BACKEND');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: QUEUE_NAME,
      },
    });
  }

  getClientProxyChallengesInstance(): ClientProxy {
    const QUEUE_NAME = this.configService.get<string>('CHALLENGE_QUEUE');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: QUEUE_NAME,
      },
    });
  }

  getClientProxyRankingsInstance(): ClientProxy {
    const RANKING_QUEUE = this.configService.get<string>('RANKING_QUEUE');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: RANKING_QUEUE,
      },
    });
  }
}
