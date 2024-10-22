import { Player } from 'src/interfaces/player.interface';

export interface Match {
  category?: string;
  challenge?: string;
  players?: Player[];
  def?: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
