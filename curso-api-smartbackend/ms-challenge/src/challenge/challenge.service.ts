import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Challenge } from './interface/challenge.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ChallengeStatus } from './enum/challenge-status.enum';
import { RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as momentTimezone from 'moment-timezone';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Injectable()
export class ChallengeService {
  private readonly logger: Logger = new Logger(ChallengeService.name);

  constructor(
    @InjectModel('challenge') private readonly challengeModel: Model<Challenge>,
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly clientNotifications =
    this.clientProxySmartRanking.getClientProxyNotificationInstance();

  async createChallenge(challenge: Challenge) {
    try {
      const newChallenge: Challenge = new this.challengeModel(challenge);

      newChallenge.solicitationDateTime = new Date();
      newChallenge.status = ChallengeStatus.PENDING;

      await newChallenge.save();

      return await lastValueFrom(
        this.clientNotifications.emit('new-challenge-notification', challenge),
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findAllChallenges() {
    try {
      return await this.challengeModel.find().populate('match').exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findChallengesByPlayerId(_id: any) {
    try {
      return await this.challengeModel.find().where('players').in(_id).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findChallengeById(_id: any) {
    try {
      return await this.challengeModel.findById({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findDoneChallenge(idCategory: string) {
    try {
      return await this.challengeModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.DONE)
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findDoneChallengeForDate(idCategory: string, refDate: string) {
    try {
      const newRefDate = `${refDate} 23:59:59.999`;

      return await this.challengeModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.DONE)
        .where('challengeDateTime')
        .lte<string>(
          momentTimezone(newRefDate).format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
          new Date(),
        )
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(_id: string, challenge: Challenge) {
    try {
      challenge.responseDateTime = new Date();

      return await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async changeChallengeStatus(matchId: string, challenge: Challenge) {
    try {
      challenge.status = ChallengeStatus.DONE;
      challenge.match = matchId;

      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(challenge: Challenge) {
    try {
      const { _id } = challenge;
      challenge.status = ChallengeStatus.CANCELLED;

      return await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
