import { Result } from 'aws-sdk/clients/codepipeline';
import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/interfaces/player.interface';

export class AssignChallengeMatch {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
