import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';
import { Channel } from 'amqp-connection-manager';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger: Logger = new Logger(AppController.name);

  @EventPattern('new-challenge-notification')
  async sendChallengeEmail(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Send mail to challenge ${JSON.stringify(challenge)}}`);
      await this.appService.sendChallengeEmail(challenge);
      channel.ack(originalMsg as any);
    } catch (error) {
      this.logger.error(error);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        channel.ack(originalMsg as any);
      }
    }
  }
}
