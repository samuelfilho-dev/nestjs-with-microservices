export interface Player {
  _id: string;
  readonly phoneNumber: string;
  readonly email: string;
  category: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  photoUrl: string;
}
