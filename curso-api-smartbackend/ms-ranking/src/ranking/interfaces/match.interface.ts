import { Player } from './player.interface';

export interface Match extends Document {
  category?: string;
  challenge?: string;
  players?: Player[];
  def?: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
