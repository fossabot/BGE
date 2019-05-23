import * as mongoose from 'mongoose';

export const GameStateSchema = new mongoose.Schema({
  gameToken: String,
  playerState: {
    field: [[String]],
  },
  userId: String,
  opponentGameId: mongoose.Schema.Types.ObjectId,
  turn: Boolean,
});
