import { Inject, Injectable } from '@nestjs/common';
import { GAME_STATE_MODEL, SIGNALR_CONNECTION } from '../constants';
import { HubConnection } from '@aspnet/signalr';
import { Model } from 'mongoose';
import { GameState } from './interface/game-state.interface';
import { AuthService } from '../auth/auth.service';
import { StartRequest } from './dto/start-request.dto';
import { PlayerState } from './interface/player-state.interface';
import { ShootResponse } from './dto/shoot-response.dto';

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

  public async start(startRequest: StartRequest) {
    const gameTokenExists = !!startRequest.gameToken;
    const gameToken = startRequest.gameToken || generateRandomToken();
    if (gameTokenExists) {
      await this.acceptGame(gameToken, startRequest.userId);
    } else {
      await this.createGame(
        startRequest.cols || 8,
        startRequest.rows || 8,
        startRequest.userId,
        gameToken,
      );
    }

    const userToken = await this.authService.getToken(startRequest.userId);
    return { gameToken, userToken };
  }

  public async shoot(userId: string, x: number, y: number) {
    const gameState: GameState = await this.gameStateModel
      .findOne({ userId })
      .exec();

    if (!gameState.turn) {
      return { message: 'Not your move' };
    }

    const opponentGameState: GameState = await this.gameStateModel
      .findOne({ _id: gameState._ref })
      .exec();

    const shootResponse: ShootResponse = await this.connection.invoke(
      'Shoot',
      { x, y },
      {
        playerState: opponentGameState.playerState,
      },
    );

    await this.gameStateModel
      .updateOne(
        { _id: opponentGameState._id },
        { playerState: shootResponse.playerState },
      )
      .exec();

    if (!shootResponse.hit) {
      await this.gameStateModel
        .updateOne({ _id: opponentGameState._id }, { turn: true })
        .exec();
      await this.gameStateModel
        .updateOne({ _id: gameState._id }, { turn: false })
        .exec();
    }

    await this.connection.send('ShootMarker', opponentGameState.userId);
  }

  public async state(userId: string) {
    const playerGameState = await this.gameStateModel
      .findOne({ userId })
      .exec();

    const opponentGameState = await this.gameStateModel
      .findOne({ _id: playerGameState._ref })
      .exec();
    opponentGameState.playerState = await this.connection.invoke(
      'Cleanse',
      opponentGameState.playerState,
    );

    return {
      playerGameState,
      opponentGameState,
    };
  }

  private async acceptGame(gameToken: string, userId: string) {
    const gameState = await this.gameStateModel
      .findOne({
        gameToken,
      })
      .exec();

    const playerState: PlayerState = await this.connection.invoke('StartGame', {
      rows: gameState.playerState.field.length,
      cols: gameState.playerState.field[0].length,
    });

    const newGameState = await new this.gameStateModel({
      playerState,
      gameToken,
      userId,
      _ref: gameState._id,
      turn: false,
    }).save();

    await this.gameStateModel
      .updateOne({ _id: gameState._id }, { _ref: newGameState._id })
      .exec();

    await this.connection.send('AcceptMarker', gameState.userId);
  }

  private async createGame(
    cols: number,
    rows: number,
    userId: string,
    gameToken: string,
  ) {
    const playerState: PlayerState = await this.connection.invoke('StartGame', {
      rows,
      cols,
    });

    await new this.gameStateModel({
      playerState,
      gameToken,
      userId,
      turn: true,
      _ref: null,
    }).save();
  }
}
