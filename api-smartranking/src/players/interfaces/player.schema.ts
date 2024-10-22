import * as mongoose from 'mongoose';

export const SchemaPlayer = new mongoose.Schema(
  {
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    rankingPosition: Number,
    photoUrl: String,
  },
  { timestamps: true, collection: 'player' },
);
