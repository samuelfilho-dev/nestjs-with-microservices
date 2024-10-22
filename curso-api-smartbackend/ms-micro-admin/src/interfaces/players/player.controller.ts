import { Controller, Logger } from '@nestjs/common';
import { PlayerService } from './player.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';
import { Channel } from 'amqp-connection-manager';

@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  private readonly logger = new Logger(PlayerController.name);
  private readonly ackErrors: string[] = ['E11000'];

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    this.logger.log(`The Player '${JSON.stringify(player)} has been created'`);

    const channel: Channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.playerService.createPlayer(player);
      channel.ack(originalMessage as any);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        channel.ack(originalMessage as any);
      }
    }
  }

  @MessagePattern('find-players')
  async findPlayers(@Payload() _id: string, @Ctx() context: RmqContext) {
    this.logger.log(`The player '${_id}' was found`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (_id) {
        return await this.playerService.findById(_id);
      } else {
        return await this.playerService.findAllPlayers();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-player')
  async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`Update Player: '${JSON.stringify(data)}'`);

    try {
      const _id: any = data._id;
      const player: Player = data.player;
      await this.playerService.updatePlayer(_id, player);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('delete-player')
  async deletePlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.playerService.deletePlayer(_id);
      await channel.ark(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }
}
