import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateChallengerDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeMatch } from './dtos/assign-challenge-match.dto';
import { ChallengeService } from './challenge.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('challenges')
@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  async createChallenge(@Body() createChallengeDto: CreateChallengerDto) {
    await this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  async findChallenges(@Query('idPlayer') idPlayer: string) {
    return await this.challengeService.findChallenges(idPlayer);
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ) {
    await this.challengeService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match')
  async assignChallengeMatch(
    @Body() assignChallengeMatch: AssignChallengeMatch,
    @Param('challenge') _id: string,
  ) {
    await this.challengeService.assignChallengeMatch(_id, assignChallengeMatch);
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string) {
    await this.challengeService.deleteChallenge(_id);
  }
}
