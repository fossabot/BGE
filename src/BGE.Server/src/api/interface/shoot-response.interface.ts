import { GameState } from './game-state.interface';

export interface ShootResponse {
  hit: boolean;
  gameState: GameState;
}
