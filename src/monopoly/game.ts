import User from './user';
import {
  systemMessages,
  systemResponse,
} from './utils';

enum GameState {
  Creating,
  AssignOrder,
  InGame,
  Rolling,
  Buying,
}

enum PlayerState {
  Waiting,
  Rolling,
  Buying,
  Prison,
  Bankrupt,
}

interface ActionSet {
  roll: boolean,
  endTurn: boolean,
  buy: boolean,
}

interface Player {
  user: User,
  currency: number,
  actions: ActionSet,
  dices: [number, number],
  playerState: PlayerState,
}

export default class Game {
  turn: Player | null = null;
  players: Array<Player> = [];
  gameState: GameState = GameState.Creating;

  initialize(users: Array<User>): SystemResponse {
    for (const user of users) {
      this.players.push({
        user,
        currency: 2000,
        actions: {
          roll: false,
          endTurn: false,
          buy: false,
        },
        dices: [0, 0],
        playerState: PlayerState.Waiting,
      });
    }
    [this.turn] = this.players;
    this.gameState = GameState.AssignOrder;
    this.setPlayersActionSet();
    return systemResponse(true, systemMessages['init success']);
  }

  setPlayersActionSet() {
    if (this.gameState === GameState.AssignOrder) {
      this.players.forEach((player) => {
        player.actions = {
          roll: false,
          endTurn: false,
          buy: false,
        };
        if (player === this.turn) {
          player.actions.roll = true;
          player.playerState = PlayerState.Rolling;
        }
      });
    }
  }

  getPlayerFromUser(user: User): Player | null {
    for (const player of this.players) {
      if (player.user === user) {
        return player;
      }
    }

    return null;
  }

  roll(user: User): SystemResponse {
    function randomDice() {
      return Math.floor(Math.random() * 6 + 1);
    }

    const player = this.getPlayerFromUser(user);
    if (!player) {
      return systemResponse(false, systemMessages['not expected']);
    }

    if (player !== this.turn) {
      return systemResponse(false, systemMessages['not turn']);
    }

    if (!player.actions.roll) {
      return systemResponse(false, systemMessages['can not roll']);
    }

    player.dices = [randomDice(), randomDice()];
    return systemResponse(true, systemMessages.rolled(...player.dices));
  }

}
