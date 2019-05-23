import { Document } from 'mongoose';
import { PlayerState } from './player-state.interface';

export interface GameState extends Document {
  playerState: PlayerState;
  gameToken: string;
  userId: string;
  opponentGameId: string;
  turn: boolean;
}
