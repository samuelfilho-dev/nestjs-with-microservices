import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';
import { IsNotEmpty } from 'class-validator';

export class AssignChallengeMatch {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
