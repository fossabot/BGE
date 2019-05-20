import { Inject, Injectable } from '@nestjs/common';
import { GAME_STATE_MODEL, SIGNALR_CONNECTION } from '../constants';
import { HubConnection } from '@aspnet/signalr';
import { Model } from 'mongoose';
import { GameState } from './interface/game-state.interface';
import { AuthService } from '../auth/auth.service';
import { StartDto } from './dto/start.dto';
import { PlayerState } from './interface/player-state.interface';

function generateRandomToken() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

@Injectable()
export class ApiService {
  constructor(
    @Inject(SIGNALR_CONNECTION) private readonly connection: HubConnection,
    @Inject(GAME_STATE_MODEL)
    private readonly gameStateModel: Model<GameState>,
    private readonly authService: AuthService,
  ) {}

  public async start(startDto: StartDto) {
    const token = await this.authService.getToken(startDto.userId);
    const gameTokenExists = !!startDto.gameToken;
    const gameToken = startDto.gameToken || generateRandomToken();
    if (gameTokenExists) {
      const gameState = await this.gameStateModel
        .findOne({
          gameToken: startDto.gameToken,
        })
        .exec();
      const playerState: PlayerState = await this.connection.invoke(
        'StartGame',
        {
          rows: gameState.playerState.field.length,
          cols: gameState.playerState.field[0].length,
        },
      );

      const newGameState = await new this.gameStateModel({
        playerState,
        gameToken,
        userId: startDto.userId,
        _ref: gameState._id,
        turn: false,
      }).save();
      await this.gameStateModel
        .updateOne({ _id: gameState._id }, { _ref: newGameState._id })
        .exec();
      await this.connection.send('AcceptMarker', gameState.userId);
    } else {
      const cols = startDto.cols || 8;
      const rows = startDto.rows || 8;

      const playerState: PlayerState = await this.connection.invoke(
        'StartGame',
        {
          rows,
          cols,
        },
      );

      await new this.gameStateModel({
        playerState,
        gameToken,
        userId: startDto.userId,
        turn: true,
        _ref: null,
      }).save();
    }

    return { gameToken, token };
  }
}
