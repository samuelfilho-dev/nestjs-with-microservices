import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Match } from './interface/match.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { RpcException } from '@nestjs/microservices';
import { Challenge } from 'src/challenge/interface/challenge.interface';
import { lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MatchService {
  private readonly logger: Logger = new Logger(MatchService.name);

  constructor(
    @InjectModel('match') private readonly matchModel: Model<Match>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  private clientRankings =
    this.clientProxySmartRanking.getClientProxyRankingsInstance();

  async createMatch(match: Match) {
    try {
      const newMatch = new this.matchModel(match);
      const result = await newMatch.save();

      const matchId = result._id;

      const challenge: Challenge = await lastValueFrom(
        this.clientChallenges.send('find-challenges', {
          idPlayer: '',
          _id: match.challenge,
        }),
      );

      await lastValueFrom(
        this.clientChallenges.emit('update-challenge-match', {
          matchId: matchId,
          challenge: challenge,
        }),
      );

      return await lastValueFrom(
        this.clientRankings.emit('process-match', {
          matchId,
          match,
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
