import { Controller, Get, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/rankings')
@ApiTags('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async checkRanking(
    @Query('categoryId') categoryId: string,
    @Query('dateRef') dateRef: string,
  ) {
    return await this.rankingService.checkRanking(categoryId, dateRef);
  }
}
