import { Controller, Logger } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Challenge } from './interface/challenge.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class ChallengeController {
  private readonly logger = new Logger(ChallengeController.name);

  constructor(private readonly challengeService: ChallengeService) {}

  @EventPattern('create-challenge')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `new Challenged been created: ${JSON.stringify(challenge)}`,
      );

      await this.challengeService.createChallenge(challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('find-challenges')
  async findChallenges(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Get Challenge Data: ${JSON.stringify(data)}`);

      const { idPlayer, _id } = data;
      if (idPlayer) {
        return await this.challengeService.findChallengesByPlayerId(idPlayer);
      } else if (_id) {
        return await this.challengeService.findChallengeById(_id);
      } else {
        return await this.challengeService.findAllChallenges();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('find-challenges-done')
  async findDoneChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Get Challenge Done with Data: ${JSON.stringify(data)}`);
      const { idCategory, dataRef } = data;
      if (dataRef) {
        return await this.challengeService.findDoneChallengeForDate(
          idCategory,
          dataRef,
        );
      } else {
        return await this.challengeService.findDoneChallenge(idCategory);
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const _id: string = data._id;
      const challenge: Challenge = data.challenge;
      await this.challengeService.updateChallenge(_id, challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
  @EventPattern('update-challenge-match')
  async changeChallengeStatus(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const matchId: string = data.matchId;
      const challenge: Challenge = data.challenge;
      await this.challengeService.changeChallengeStatus(matchId, challenge);

      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengeService.deleteChallenge(challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
