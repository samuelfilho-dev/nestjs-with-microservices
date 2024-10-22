import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { ValidatorParamPipe } from '../commom/pipes/validator-param.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Get()
  async findAllPlayers(): Promise<Player[]> {
    return this.playerService.findAllPlayers();
  }

  @Get('/:_id')
  async findPlayerById(
    @Param('_id', ValidatorParamPipe) _id: string,
  ): Promise<Player> {
    return this.playerService.findPlayerById(_id);
  }

  @Put('/:_id')
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidatorParamPipe) _id: string,
  ): Promise<void> {
    this.playerService.updatePlayer(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidatorParamPipe) _id: string,
  ): Promise<void> {
    this.playerService.deletePlayer(_id);
  }
}
