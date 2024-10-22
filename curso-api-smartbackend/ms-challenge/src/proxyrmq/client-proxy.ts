import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private readonly configService: ConfigService) {}
  private readonly RABBITMQ_URL =
    this.configService.get<string>('RABBITMQ_URL');

  getClientProxyAdminBackendInstance(): ClientProxy {
    const ADMIN_BACKEND = this.configService.get<string>('ADMIN_BACKEND');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: ADMIN_BACKEND,
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

  getClientProxyNotificationInstance(): ClientProxy {
    const NOTIFICATION_QUEUE =
      this.configService.get<string>('NOTIFICATION_QUEUE');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: NOTIFICATION_QUEUE,
      },
    });
  }
}
