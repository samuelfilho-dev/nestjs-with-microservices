export interface Player {
  readonly _id: string;
  readonly email: string;
  readonly phoneNumber: string;
  category: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  photoUrl: string;
}
