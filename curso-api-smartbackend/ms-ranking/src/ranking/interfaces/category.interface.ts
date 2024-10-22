import { Player } from './player.interface';

export interface Category {
  _id: string;
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
