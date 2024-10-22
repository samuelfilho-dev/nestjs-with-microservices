import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';

export class CreateChallengerDto {
  @IsNotEmpty()
  @IsDateString()
  challengeDateTime: Date;

  @IsNotEmpty()
  requester: Player;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMaxSize(2)
  players: Array<Player>;
}
