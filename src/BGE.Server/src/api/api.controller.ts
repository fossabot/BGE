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
import { StateDto } from './dto/state.dto';
import { AuthService } from '../auth/auth.service';

interface IDB {
  _id: string;
  gameToken: string;
  state: PlayerState;
  userId: string;
  ref?: string;
  turn: boolean;
}

function generateRandomId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

@Controller('api')
export class ApiController {
  private db: IDB[] = [];

  constructor(
    @Inject('SIGNALR_CONNECTION') private readonly connection: HubConnection,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('/state')
  public async state(@Body() stateDto: StateDto) {
    const player = this.db.find(value => value.userId === stateDto.userId);
    const enemy = JSON.parse(
      JSON.stringify(this.db.find(value => value._id === player.ref)),
    );
    enemy.state = await this.connection.invoke('Cleanse', enemy.state);
    return {
      player,
      enemy,
    };
  }

  @Post('/reset')
  public async reset() {
    this.db = [];
  }

  @HttpCode(200)
  @Post('/start')
  public async start(@Body() startDto: StartDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    const token = await this.authService.getToken(startDto.userId);
    const gameTokenExists = !!startDto.gameToken;
    const gameToken = startDto.gameToken || 'gameToken1';
    if (gameTokenExists) {
      const index = this.db.findIndex(
        item => item.gameToken === startDto.gameToken,
      );
      const state = this.db[index];
      const gameState: GameState = await this.connection.invoke('StartGame', {
        rows: state.state.field.length,
        cols: state.state.field[0].length,
      });

      const id = generateRandomId();
      this.db.push({
        state: gameState.playerState,
        gameToken,
        userId: startDto.userId,
        _id: id,
        ref: state._id,
        turn: false,
      });
      this.db[index].ref = id;
      await this.connection.send('AcceptMarker', state.userId);
    } else {
      const cols = startDto.cols || 8;
      const rows = startDto.rows || 8;

      const gameState: GameState = await this.connection.invoke('StartGame', {
        rows,
        cols,
      });

      this.db.push({
        _id: generateRandomId(),
        userId: startDto.userId,
        gameToken,
        state: gameState.playerState,
        turn: true,
      });
    }

    return { gameToken, token };
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootDto: ShootDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    const playerState = this.db.find(value => value.userId === shootDto.userId);
    if (!playerState.turn) {
      return { message: 'Not your move' };
    }

    const playerStateIndex = this.db.indexOf(playerState);
    const enemyState = this.db.find(value => value._id === playerState.ref);
    const enemyStateIndex = this.db.indexOf(enemyState);
    const gameState: GameState = await this.connection.invoke(
      'Shoot',
      { x: shootDto.x, y: shootDto.y },
      {
        playerState: enemyState.state,
      },
    );
    this.db[enemyStateIndex].state = gameState.playerState;
    this.db[enemyStateIndex].turn = true;
    this.db[playerStateIndex].turn = false;
    await this.connection.send('ShootMarker', enemyState.userId);
  }
}
