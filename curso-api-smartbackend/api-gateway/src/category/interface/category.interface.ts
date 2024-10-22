import { Player } from '../../interfaces/player.interface';

export interface Category {
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
