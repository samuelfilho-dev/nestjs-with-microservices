import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingSchema } from './interfaces/ranking.schema';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [
    ProxymqModule,
    MongooseModule.forFeature([{ name: 'ranking', schema: RankingSchema }]),
  ],
  providers: [RankingService],
  controllers: [RankingController],
})
export class RankingModule {}
