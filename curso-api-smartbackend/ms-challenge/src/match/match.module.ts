import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interface/match.schema';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ProxyrmqModule,
    MongooseModule.forFeature([{ name: 'match', schema: MatchSchema }]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
