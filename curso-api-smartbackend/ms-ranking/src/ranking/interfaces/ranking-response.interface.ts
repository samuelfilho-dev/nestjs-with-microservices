export interface RankingResponse {
  player?: string;
  position?: number;
  points?: number;
  MatchHistory: History;
}

export interface History {
  victories?: number;
  defeats: number;
}
