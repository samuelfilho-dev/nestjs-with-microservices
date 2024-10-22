import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    challengeDateTime: { type: Date },
    status: { type: String },
    solicitationDateTime: { type: Date },
    responseDateTime: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'player' },
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player',
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'matches',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
