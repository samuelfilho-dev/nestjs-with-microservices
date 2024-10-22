import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [ProxyModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
