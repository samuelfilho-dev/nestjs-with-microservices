import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { RankingService } from './ranking.service';

@Module({
  imports: [ProxyModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
