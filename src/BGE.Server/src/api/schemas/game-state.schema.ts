import * as mongoose from 'mongoose';

const PlayerStateSchema = new mongoose.Schema({
  field: [[String]],
});

export const GameStateSchema = new mongoose.Schema({
  gameToken: String,
  playerState: PlayerStateSchema,
  userId: String,
  _ref: mongoose.Schema.Types.ObjectId,
  turn: Boolean,
});
