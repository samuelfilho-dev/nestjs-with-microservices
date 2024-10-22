import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/challenge.interface';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { AssignChallengeMatch } from './dtos/assign-challenge-match.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengerDto: CreateChallengerDto,
  ): Promise<Challenge> {
    return await this.challengeService.createChallenge(createChallengerDto);
  }

  @Get()
  async findAllChallenges(
    @Query('playerId') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengeService.findChallengeByPlayer(_id)
      : await this.challengeService.findAllChallenges();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengeService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match')
  async assignChallengeMatch(
    @Body(ValidationPipe) assignChallengeMatch: AssignChallengeMatch,
    @Param('challenge') _id: string,
  ) {
    return await this.challengeService.assignChallengeMatch(
      _id,
      assignChallengeMatch,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    return this.challengeService.deleteChallenge(_id);
  }
}
