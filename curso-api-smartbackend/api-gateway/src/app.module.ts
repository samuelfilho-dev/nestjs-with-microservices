import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { ProxyModule } from './proxy/proxy.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';
import { RankingModule } from './ranking/ranking.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CategoryModule,
    PlayerModule,
    ProxyModule,
    AwsModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ChallengeModule,
    RankingModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
