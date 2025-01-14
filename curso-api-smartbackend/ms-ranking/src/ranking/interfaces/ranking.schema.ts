import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'ranking' })
export class Ranking extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  challenge: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'player' })
  player: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  match: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: string;

  @Prop()
  event: string;

  @Prop()
  operation: string;

  @Prop()
  points: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
