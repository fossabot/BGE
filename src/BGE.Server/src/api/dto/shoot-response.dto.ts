import { PlayerState } from '../interfaces/player-state.interface';
import { IsBoolean } from 'class-validator';

export class ShootResponse {
  @IsBoolean()
  hit: boolean;

  playerState: PlayerState;
}
