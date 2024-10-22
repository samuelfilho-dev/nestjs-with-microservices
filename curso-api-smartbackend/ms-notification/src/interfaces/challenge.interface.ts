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

export enum ChallengeStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  CANCELLED = 'CANCELLED',
}
