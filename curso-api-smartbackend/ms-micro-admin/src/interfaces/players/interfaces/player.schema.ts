import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    ranking: String,
    rankingPosition: Number,
    photoUrl: String,
  },
  { timestamps: true, collection: 'player' },
);
