import { Controller, Logger } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Match } from './interfaces/match.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel } from 'amqp-connection-manager';

const ackErrors: string[] = ['E11000'];

@Controller()
export class RankingController {
  private readonly logger = new Logger(RankingController.name);

  constructor(private readonly rankingService: RankingService) {}

  @EventPattern('process-match')
  async processMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `Process with data: ${JSON.stringify(data)} has been started`,
      );

      const matchId: string = data.matchId;
      const match: Match = data.match;

      await this.rankingService.processMatch(matchId, match);
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

  @MessagePattern('check-ranking')
  async checkRanking(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `Check Ranking with data: ${JSON.stringify(data)} has been started`,
      );

      const { categoryId, dateRef } = data;
      return await this.rankingService.checkRanking(categoryId, dateRef);
    } catch (error) {
      this.logger.error(error.message);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
