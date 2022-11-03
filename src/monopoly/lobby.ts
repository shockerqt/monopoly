import Game from './game';
import MonopolyServer from './server';
import User from './user';
import {
  systemMessages,
  systemResponse,
} from './utils';

export default class Lobby {
  id: number;
  name: string;
  server: MonopolyServer;
  master: User;
  game: Game;
  password: string | null;
  state: 'creating' | 'ingame' = 'creating';
  users: Array<User> = [];

  constructor(server: MonopolyServer, id: number, user: User, name: string, password: string | null = null) {
    this.id = id;
    this.name = name;
    this.server = server;
    this.master = user;
    this.password = password || null;
    this.game = new Game();
    this.join(user, this.password);
  }

  log() {
    console.log(`
      LOBBY LOG:
      id: ${this.id}
      name: ${this.name}
      players:${this.users.map((user) => ` ${user.nick}${user === this.master ? '👑' : ''}`)}
    `);
  }

  getData(): LobbyData {
    return {
      id: this.id,
      name: this.name,
      users: this.users.map((user) => ({ id: user.id, nick: user.nick })),
      hasPassword: this.password !== null,
      masterId: this.master.id,
      state: this.state,
    };
  }

  /**
     * Join a game that is not yet initialized
     * @param user the user who tries to join
     * @returns A proper response
     */
  join(user: User, password: string | null): SystemResponse {
    if (this.state !== 'creating') {
      return systemResponse(false, systemMessages['already init']);
    }

    if (this.users.includes(user)) {
      return systemResponse(false, systemMessages['already joined'](user.nick));
    }

    if (this.users.length > 3) {
      return systemResponse(false, systemMessages['game full']);
    }

    if (this.password && this.password !== password) {
      return systemResponse(false, systemMessages['wrong password']);
    }

    user.lobby = this;
    this.users.push(user);
    return systemResponse(true, systemMessages['join success'](user.nick));
  }

  /**
     * Leave a game that is not yet initialized if the user is in
     * @param user the user who tries to leave
     * @returns A proper response
     */
  leave(user: User): SystemResponse {
    if (this.state !== 'creating') {
      return systemResponse(false, systemMessages['already init']);
    }

    if (!this.users.includes(user)) {
      return systemResponse(false, systemMessages['not in game'](user.nick));
    }

    this.users.splice(this.users.findIndex((element) => element === user), 1);
    user.lobby = null;
    // Delete room if no user left
    if (this.users.length === 0) this.server.deleteLobby(this);
    // Pass the roomMaster to next user
    if (this.master === user) [this.master] = this.users;

    return systemResponse(true, systemMessages['leave success']);
  }

  changeRoomName(user: User, name: string): SystemResponse {
    if (this.master !== user) {
      return systemResponse(false, systemMessages['not master']);
    }
    this.name = name;
    return systemResponse(true, systemMessages['name changed'](name));
  }

  changeRoomPassword(user: User, password: string | null): SystemResponse {
    if (this.master !== user) {
      return systemResponse(false, systemMessages['not master']);
    }
    this.password = password;
    return systemResponse(true, systemMessages['password changed']);
  }

  /**
   * Initialize the game after all users have joined
   * @param user The user who started the game, must be masterRoom
   * @returns A proper response
   */
  startGame(user: User): SystemResponse {
    if (this.master !== user) {
      return systemResponse(false, systemMessages['not master']);
    }

    if (this.state !== 'creating') {
      return systemResponse(false, systemMessages['already init']);
    }

    this.state = 'ingame';
    return this.game.initialize(this.users);
  }

}
