import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema(
  {
    category: { type: String, unique: true },
    description: { type: String },
    events: [
      {
        name: { type: String },
        operation: { type: String },
        value: { type: Number },
      },
    ],
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player',
      },
    ],
  },
  { timestamps: true, collection: 'category' },
);
