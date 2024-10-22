import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayerService.name);

  async createPlayer(player: Player) {
    try {
      const playerCreated = new this.playerModel(player);
      await playerCreated.save();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async findAllPlayers() {
    try {
      return await this.playerModel.find().exec();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async findById(_id: string) {
    try {
      return await this.playerModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async updatePlayer(_id: any, player: Player) {
    try {
      return await this.playerModel
        .findOneAndUpdate({ _id }, { $set: player })
        .exec();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async deletePlayer(_id: string) {
    try {
      return await this.playerModel.deleteOne({ _id }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }
}
