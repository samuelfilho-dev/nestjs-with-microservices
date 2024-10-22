import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Player } from 'src/interfaces/player.interface';

export class CreateChallengerDto {
  @IsNotEmpty()
  @IsDateString()
  challengeDateTime: Date;

  @IsNotEmpty()
  requester: string;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMaxSize(2)
  players: Array<Player>;

  @IsString()
  category: string;
}
