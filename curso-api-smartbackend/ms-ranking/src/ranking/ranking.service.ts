import { Injectable, Logger } from '@nestjs/common';
import { Match } from './interfaces/match.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ranking } from './interfaces/ranking.schema';
import { RpcException } from '@nestjs/microservices';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy';
import { Category } from './interfaces/category.interface';
import { lastValueFrom } from 'rxjs';
import { EventName } from './enums/event-name.enum';
import {
  History,
  RankingResponse,
} from './interfaces/ranking-response.interface';
import * as momentTimeZone from 'moment-timezone';
import * as _ from 'loadsh';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class RankingService {
  constructor(
    @InjectModel('ranking') private readonly rankingModel: Model<Ranking>,
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(RankingService.name);

  private readonly clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private readonly clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  async processMatch(matchId: string, match: Match) {
    try {
      this.logger.log(
        `Process in service with data: ${JSON.stringify(matchId)} & ${JSON.stringify(match)} has been started`,
      );

      const category: Category = await lastValueFrom(
        this.clientAdminBackend.send('find-categories', match.category),
      );

      await Promise.all(
        match.players.map(async (player) => {
          const newRanking = new this.rankingModel();
          newRanking.category = match.category;
          newRanking.challenge = match.challenge;
          newRanking.match = matchId;
          // TODO: Melhorar o Cast de Player
          newRanking.player = player as any;

          if (player == match.def) {
            const [victoryEvent] = category.events.filter(
              (event) => event.name == EventName.VICTORY,
            );

            newRanking.event = EventName.VICTORY;
            newRanking.points = victoryEvent.value;
            newRanking.operation = victoryEvent.operation;
          } else {
            const [defeatEvent] = category.events.filter(
              (event) => event.name == EventName.DEFEAT,
            );

            newRanking.event = EventName.DEFEAT;
            newRanking.points = defeatEvent.value;
            newRanking.operation = defeatEvent.operation;
          }
          this.logger.log(`Ranking ${JSON.stringify(newRanking)} is processed`);
          await newRanking.save();
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new RpcException(error.message);
    }
  }

  async checkRanking(
    idCategory: any,
    dateRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      this.logger.log(
        `Check Ranking in service with data: ${JSON.stringify(idCategory)} & ${JSON.stringify(dateRef)} `,
      );

      if (!dateRef) {
        dateRef = momentTimeZone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
      }

      const rankingRegister = await this.rankingModel
        .find()
        .where('category')
        .equals(idCategory)
        .exec();

      const challenges: Challenge[] = await lastValueFrom(
        this.clientChallenges.send('find-challenges-done', {
          idCategory,
          dateRef,
        }),
      );

      await _.remove(rankingRegister, (item: any) => {
        return (
          challenges.filter((challenge) => challenge._id == item.challenge)
            .length === 0
        );
      });

      const result = await _(rankingRegister)
        .groupBy('player')
        .map((items: any, key: number) => ({
          player: key,
          history: _.countBy(items, 'event'),
          points: _.sumBy(items, 'points'),
        }))
        .value();

      const orderResult = await _.orderBy(result, 'points', 'desc');

      const rankingResponseList: RankingResponse[] = [];
      orderResult.map((item: any, index: number) => {
        const rankingResponse = {} as RankingResponse;
        rankingResponse.player = item.player;
        rankingResponse.position = index + 1;
        rankingResponse.points = item.points;

        const history = {} as History;
        history.victories = item.history.VICTORY ? item.history.VICTORY : 0;
        history.defeats = item.history.DEFEAT ? item.history.DEFEAT : 0;

        rankingResponse.MatchHistory = history;

        rankingResponseList.push(rankingResponse);

        return rankingResponseList;
      });

      this.logger.log(
        `This Ranking list ${JSON.stringify(rankingResponseList)}`,
      );

      return rankingResponseList;
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new RpcException(error.message);
    }
  }
}
