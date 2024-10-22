import { Player } from 'src/interfaces/player.interface';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge {
  challengeDateTime: Date;
  status: ChallengeStatus;
  solicitationDateTime: Date;
  responseDateTime: Date;
  requester: Player;
  category: string;
  match?: string;
  players: Array<Player>;
}
