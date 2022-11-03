import User from './user';
import Lobby from './lobby';
import { systemMessages, systemResponse } from './utils';

export default class MonopolyServer {
  users: Array<User> = [];
  lobbies: Array<Lobby> = [];
  maxLobbies = 40;

  log() {
    console.log(`
      LOBBY LOG:
      users:${this.users.map((user) => ` ${user.nick}`)}
      rooms:${this.lobbies.map((lobby) => ` ${lobby.name}`)}
    `);
  }

  getData(): ServerData {
    return {
      users: this.users.map((user) => ({ id: user.id, nick: user.nick })),
      lobbies: this.lobbies.map((lobby) => ({
        id: lobby.id,
        name: lobby.name,
        users: lobby.users.map((user) => ({
          id: user.id,
          nick: user.nick,
        })),
        hasPassword: lobby.password !== null,
        masterId: lobby.master.id,
        state: lobby.state,
      })),
    };
  }

  createUser(name = 'nameless') {
    const id = this.getUserId();
    const user = new User(id, name, this);
    this.users.push(user);
    return user;
  }

  createLobby(user: User, name: string, password: string | null = null): SystemResponse {
    if (user.lobby !== null) {
      return systemResponse(false, systemMessages['already in room']);
    }

    if (this.lobbies.length >= this.maxLobbies) {
      return systemResponse(false, systemMessages['lobby full']);
    }
    const id = this.getNewLobbyId();
    this.lobbies.push(new Lobby(this, id, user, name, password));
    return systemResponse(true, systemMessages['room created']);
  }

  deleteLobby(lobby: Lobby) {
    this.lobbies.splice(this.lobbies.findIndex((element) => element === lobby), 1);
  }

  getNewLobbyId(): number {
    if (this.lobbies.length === 0) {
      return 1;
    }

    const lastId = this.lobbies[this.lobbies.length - 1].id;
    return lastId + 1;
  }

  getUserId(): number {
    if (this.users.length === 0) {
      return 1;
    }

    const lastId = this.users[this.users.length - 1].id;
    return lastId + 1;
  }

  searchLobbyById(id: number): Lobby | null {
    for (const lobby of this.lobbies) {
      if (lobby.id === id) {
        return lobby;
      }
    }
    return null;
  }
}
