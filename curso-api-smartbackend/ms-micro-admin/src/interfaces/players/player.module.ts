import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerService } from './player.service';
import { PlayerSchema } from './interfaces/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'player', schema: PlayerSchema }]),
  ],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
