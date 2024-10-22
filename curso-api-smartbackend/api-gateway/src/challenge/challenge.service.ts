import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateChallengerDto } from './dtos/create-challenge.dto';
import { ProxyProvider } from 'src/proxy/proxy.provider';
import { lastValueFrom } from 'rxjs';
import { Player } from 'src/interfaces/player.interface';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';
import { AssignChallengeMatch } from './dtos/assign-challenge-match.dto';

@Injectable()
export class ChallengeService {
  constructor(private readonly proxyProvider: ProxyProvider) {}

  private readonly clientAdminBackend =
    this.proxyProvider.getClientProxyAdminBackendInstance();

  private readonly challengeClient =
    this.proxyProvider.getClientProxyChallengesInstance();

  async createChallenge(createChallengeDto: CreateChallengerDto) {
    const players: Player[] = await lastValueFrom(
      this.clientAdminBackend.send('find-players', ''),
    );

    createChallengeDto.players.map((playerDto) => {
      const playersFilter: Player[] = players.filter(
        (player) => (player._id = playerDto._id),
      );

      if (playersFilter.length == 0) {
        throw new UnprocessableEntityException(
          `Id ${playerDto._id} is not a player`,
        );
      }

      if (playersFilter[0].category != createChallengeDto.category) {
        throw new UnprocessableEntityException(
          `The player ${playersFilter[0]._id} is not part of the category entered`,
        );
      }
    });

    const requesterIsPlayerOfMatch: Player[] =
      createChallengeDto.players.filter(
        (player) => player._id == createChallengeDto.requester,
      );

    if (requesterIsPlayerOfMatch.length == 0) {
      throw new UnprocessableEntityException(
        `The Requester must be a player on Match`,
      );
    }

    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        'find-categories',
        createChallengeDto.category,
      ),
    );

    if (!category) {
      throw new NotFoundException(`Category is not exists`);
    }

    await lastValueFrom(
      this.challengeClient.emit('create-challenge', createChallengeDto),
    );
  }

  async findChallenges(idPlayer: string) {
    if (idPlayer) {
      const player: Player = await lastValueFrom(
        this.clientAdminBackend.send('find-players', idPlayer),
      );

      if (!player) {
        throw new NotFoundException(`User not exists`);
      }
    }

    return await lastValueFrom(
      this.challengeClient.send('find-challenges', {
        idPlayer: idPlayer,
        _id: '',
      }),
    );
  }

  async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto) {
    const challenge: Challenge = await lastValueFrom(
      this.challengeClient.send('find-challenges', { _id }),
    );

    if (!challenge) {
      throw new NotFoundException(`Challenge is not exists`);
    }

    if (challenge.status != ChallengeStatus.PENDING) {
      throw new ConflictException(
        `Only challenges with 'PENDING' status can be updated`,
      );
    }

    await lastValueFrom(
      this.challengeClient.emit('update-challenge', {
        _id: _id,
        challenge: updateChallengeDto,
      }),
    );
  }

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatch: AssignChallengeMatch,
  ) {
    const challenge: Challenge = await lastValueFrom(
      this.challengeClient.send('find-challenges', { idPlayer: '', _id }),
    );

    if (!challenge) {
      throw new NotFoundException(`Challenge is not exists`);
    }

    if (challenge.status == ChallengeStatus.DONE) {
      throw new ConflictException(`Challenge already done`);
    }

    if (challenge.status != ChallengeStatus.ACCEPTED) {
      throw new ConflictException(
        `Matches can only be launched in challenges accepted by opponents`,
      );
    }

    if (!challenge.players.includes(assignChallengeMatch.def)) {
      throw new ConflictException(
        `The player who wins the match must be part of the challenge`,
      );
    }

    const match = {} as any;
    match.category = challenge.category;
    match.def = assignChallengeMatch.def;
    match.challenge = _id;
    match.players = challenge.players;
    match.result = assignChallengeMatch.result;

    await lastValueFrom(this.challengeClient.emit('create-match', match));
  }

  async deleteChallenge(_id: string) {
    const challenge: Challenge = await lastValueFrom(
      this.challengeClient.send('find-challenges', { idPlayer: '', _id }),
    );

    if (!challenge) {
      throw new NotFoundException(`Challenge is not exists`);
    }

    await lastValueFrom(
      this.challengeClient.emit('delete-challenge', challenge),
    );
  }
}
