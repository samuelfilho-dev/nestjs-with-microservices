import { Document } from 'mongoose';
import { ChallengeStatus } from '../enum/challenge-status.enum';
import { Player } from './player.interface';

export interface Challenge extends Document {
  challengeDateTime: Date;
  status: ChallengeStatus;
  solicitationDateTime: Date;
  responseDateTime: Date;
  requester: Player;
  category: string;
  match?: string;
  players: string[];
}
