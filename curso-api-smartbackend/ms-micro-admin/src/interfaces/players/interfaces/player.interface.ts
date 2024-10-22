import { Document } from 'mongoose';

export interface Player extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  category: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  photoUrl: string;
}
