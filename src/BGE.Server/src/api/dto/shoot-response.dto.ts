import { PlayerState } from '../interface/player-state.interface';

export interface ShootResponse {
  hit: boolean;
  playerState: PlayerState;
}
