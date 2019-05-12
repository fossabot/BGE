import {
  Body,
  Controller,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import { ShootDto } from './dto/shoot.dto';
import { StartDto } from './dto/start.dto';
import { GameState } from './interface/game-state.interface';
import { PlayerState } from './interface/player-state.interface';

interface IState {
  hostToken: string;
  hostState: PlayerState;
  playerToken?: string;
  playerState?: PlayerState;
  rows: number;
  cols: number;
}

@Controller('api')
export class ApiController {
  private states: IState[] = [];

  constructor(
    @Inject('SIGNALR_CONNECTION') private readonly connection: HubConnection,
  ) {}

  @HttpCode(200)
  @Post('/start')
  public async start(@Body() startDto: StartDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    startDto = startDto || {};
    let token = startDto.token;
    let playerState;
    if (!!token) {
      const index = this.states.findIndex(item => item.hostToken === token);
      const state = this.states[index];
      const gameState: GameState = await this.connection.invoke('StartGame', {
        rows: state.rows,
        cols: state.cols,
      });
      playerState = gameState.playerState;
      this.states[index].playerToken = 'token2';
      this.states[index].playerState = playerState;
      token = 'token2';
    } else {
      const cols = startDto.cols || 8;
      const rows = startDto.rows || 8;

      const gameState = await this.connection.invoke('StartGame', {
        rows,
        cols,
      });
      playerState = gameState.playerState;

      this.states.push({
        hostState: gameState.playerState,
        hostToken: 'token1',
        cols,
        rows,
      });
      token = 'token1';
    }
    return { playerState, token };
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootDto: ShootDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    const state = this.states.find(
      value =>
        value.playerToken === shootDto.token ||
        value.hostToken === shootDto.token,
    );

    if (!state) {
      throw new InternalServerErrorException('State is not found');
    }

    const index = this.states.findIndex(
      value =>
        value.playerToken === shootDto.token ||
        value.hostToken === shootDto.token,
    );

    let gameState: GameState;
    if (state.hostToken === shootDto.token) {
      gameState = await this.connection.invoke(
        'Shoot',
        { x: shootDto.x, y: shootDto.y },
        {
          playerState: state.playerState,
        },
      );
      this.states[index].playerState = gameState.playerState;
    } else {
      gameState = await this.connection.invoke(
        'Shoot',
        { x: shootDto.x, y: shootDto.y },
        {
          playerState: state.playerState,
        },
      );
      this.states[index].hostState = gameState.playerState;
    }
    return gameState;
  }
}
