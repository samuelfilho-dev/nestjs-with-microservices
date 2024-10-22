import { Module } from '@nestjs/common';
import { RankingModule } from './ranking/ranking.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxymqModule } from './proxymq/proxymq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
    RankingModule,
    ProxymqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
