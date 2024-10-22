import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaPlayer } from './interfaces/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'player', schema: SchemaPlayer }]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
