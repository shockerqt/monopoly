import Player from './player';

export interface GameResponse {
  success: boolean,
  message: string,
}

const systemMessages = {
  // init
  'already init': 'The game is already initialized',
  'init success': 'The game was initialized succesfully',

  // join
  'join success': (playerNick: string) => `${playerNick} joined the game`,
  'already joined': (playerNick: string) => `${playerNick} is already in the game`,
  'game full': 'The game is full',

  // leave
  'not in game': (playerNick: string) => `${playerNick} is not in this game`,
};

export default class Game {
  players: Array<Player> = [];
  state: 'creating' | 'running' | 'finished' = 'creating';
  turn: Player | null = null;

  response(success: boolean, message: string): GameResponse {
    return { success, message };
  }

  /**
   * Initialize the game after all players have joined
   * @returns A proper response
   */
  initialize(): GameResponse {
    if (this.state !== 'creating') {
      return this.response(false, systemMessages['already init']);
    }

    this.state = 'running';
    return this.response(true, systemMessages['init success']);
  }

  /**
   * Join a game that is not yet initialized
   * @param player the player who tries to join
   * @returns A proper response
   */
  join(player: Player): GameResponse {
    if (this.state !== 'creating') {
      return this.response(false, systemMessages['already init']);
    }

    if (this.players.includes(player)) {
      return this.response(false, systemMessages['already joined'](player.nick));
    }

    if (this.players.length > 3) {
      return this.response(false, systemMessages['game full']);
    }

    this.players.push(player);
    return this.response(true, systemMessages['join success'](player.nick));
  }

  /**
   * Leave a game that is not yet initialized if the player is in
   * @param player the player who tries to leave
   * @returns A proper response
   */
  leave(player: Player): GameResponse {
    if (this.state !== 'creating') {
      return this.response(false, systemMessages['already init']);
    }

    if (!this.players.includes(player)) {
      return this.response(false, systemMessages['not in game'](player.nick));
    }

    this.players.splice(this.players.findIndex((element) => element === player), 1);
    return this.response(true, systemMessages['join success'](player.nick));
  }

}
