import { Document } from 'mongoose';

export interface PlayerState extends Document {
  field: string[][];
}
