import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeMatch } from './dtos/assign-challenge-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('challenges')
    private readonly challengeModel: Model<Challenge>,
    @InjectModel('matches')
    private readonly matchesModel: Model<Match>,
    private readonly playerService: PlayersService,
    private readonly categoryService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengerDto: CreateChallengerDto,
  ): Promise<Challenge> {
    const players = await this.playerService.findAllPlayers();

    createChallengerDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new UnprocessableEntityException(
          `Id: ${playerDto._id} is not a player`,
        );
      }
    });

    const requesterIsPlayerOfMatch = createChallengerDto.players.filter(
      (player) => player._id == createChallengerDto.requester,
    );

    if (requesterIsPlayerOfMatch.length == 0) {
      throw new UnprocessableEntityException(
        `The Requester must be a player on Match`,
      );
    }

    const playerCategory = await this.categoryService.findCategoryByPlayer(
      createChallengerDto.requester,
    );

    if (playerCategory === null) {
      throw new UnprocessableEntityException(
        `Requester must be registered in a category `,
      );
    }

    const challengeCreated = new this.challengeModel(createChallengerDto);
    challengeCreated.category = playerCategory.category;
    challengeCreated.solicitationDateTime = new Date();
    challengeCreated.status = ChallengeStatus.PENDING;

    return await challengeCreated.save();
  }

  async findAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async findChallengeByPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playerService.findAllPlayers();
    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`id: ${_id} is not a Player`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto) {
    const findedchallenge = await this.challengeModel.findById(_id).exec();

    if (!findedchallenge) {
      throw new NotFoundException(`Challenge '${_id} is not exists'`);
    }

    if (updateChallengeDto.status) {
      findedchallenge.responseDateTime = new Date();
    }

    findedchallenge.status = updateChallengeDto.status;
    findedchallenge.challengeDateTime = updateChallengeDto.challengeDateTime;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: findedchallenge })
      .exec();
  }

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatch: AssignChallengeMatch,
  ) {
    const findedchallenge = await this.challengeModel.findById(_id).exec();

    if (!findedchallenge) {
      throw new NotFoundException(`Challenge '${_id} is not exists'`);
    }

    if (findedchallenge.status === ChallengeStatus.DONE) {
      throw new UnprocessableEntityException(`The Challenge already been Done`);
    }

    const playerFilter = findedchallenge.players.filter(
      (player) => player._id == assignChallengeMatch.def,
    );

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `The winning player is not part of the challenge`,
      );
    }

    const createdMatch = new this.matchesModel(assignChallengeMatch);
    createdMatch.category = findedchallenge.category;
    createdMatch.players = findedchallenge.players;

    const result = await createdMatch.save();

    findedchallenge.status = ChallengeStatus.DONE;
    findedchallenge.match = result;

    try {
      await this.challengeModel.findOneAndUpdate(
        { _id },
        { $set: findedchallenge },
      );
    } catch (error) {
      this.logger.error(error);
      await this.matchesModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string) {
    const findedchallenge = await this.challengeModel.findById(_id).exec();

    if (!findedchallenge) {
      throw new NotFoundException(`Challenge '${_id} is not exists'`);
    }

    findedchallenge.status = ChallengeStatus.CANCELLED;

    await this.challengeModel.findOneAndUpdate(
      { _id },
      { $set: findedchallenge },
    );
  }
}
