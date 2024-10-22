import { ChallengeStatus } from '../enums/challenge-status.enum';
import { Player } from './player.interface';

export interface Challenge {
  _id: string;
  challengeDateTime: Date;
  status: ChallengeStatus;
  solicitationDateTime: Date;
  responseDateTime: Date;
  requester: Player;
  category: string;
  match?: string;
  players: Array<Player>;
}
