import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const findedPlayer = await this.playerModel.findOne({ email }).exec();

    if (findedPlayer) {
      throw new UnprocessableEntityException(
        `Player with E-mail: '${email}' already exists`,
      );
    }

    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const findedPlayer = await this.playerModel.findOne({ email }).exec();

    if (!findedPlayer) {
      throw new NotFoundException(`Player with E-mail: '${email}' Not Found`);
    }

    return findedPlayer;
  }

  async findPlayerById(_id: string): Promise<Player> {
    const findedPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!findedPlayer) {
      throw new NotFoundException(`Player with id: '${_id}' Not Found`);
    }

    return findedPlayer;
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    const findedPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!findedPlayer) {
      throw new NotFoundException(`Player with id: '${_id}' not exits`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async deletePlayer(_id: string): Promise<any> {
    const findedPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!findedPlayer) {
      throw new NotFoundException(`Player with id: '${_id}' not exits`);
    }

    return await this.playerModel.deleteOne({ _id }).exec();
  }
}
