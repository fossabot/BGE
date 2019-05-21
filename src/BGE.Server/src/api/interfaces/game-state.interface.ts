import { Document } from 'mongoose';
import { PlayerState } from './player-state.interface';

export interface GameState extends Document {
  playerState: PlayerState;
  gameToken: string;
  userId: string;
  _ref: string;
  turn: boolean;
}
