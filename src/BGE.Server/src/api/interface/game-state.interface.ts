import { PlayerState } from './player-state.interface';
import { Document } from 'mongoose';

export interface GameState extends Document {
  playerState: PlayerState;
  gameToken: string;
  userId: string;
  _ref: string;
  turn: boolean;
}
