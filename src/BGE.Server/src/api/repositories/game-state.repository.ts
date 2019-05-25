import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { GAME_STATE_MODEL } from '../../common/constants';
import { GameState } from '../interfaces/game-state.interface';

@Injectable()
export class GameStateRepository {
  constructor(
    @Inject(GAME_STATE_MODEL)
    private readonly gameStateModel: Model<GameState>,
  ) {}

  public create(doc: Partial<GameState>): Promise<GameState> {
    return new this.gameStateModel(doc).save();
  }

  public findByUserId(userId: string): Promise<GameState> {
    return this.gameStateModel.findOne({ userId }).exec();
  }

  public findById(id: string): Promise<GameState> {
    return this.gameStateModel.findOne({ _id: id }).exec();
  }

  public findByGameToken(gameToken: string): Promise<GameState> {
    return this.gameStateModel.findOne({ gameToken }).exec();
  }

  public updateOneById(
    id: string,
    doc: Partial<GameState>,
  ): Promise<GameState> {
    return this.gameStateModel.updateOne({ _id: id }, doc).exec();
  }
}
