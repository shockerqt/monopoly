import MonopolyServer from './server';
import Lobby from './lobby';
import {
  systemMessages,
  systemResponse,
} from './utils';

export default class User {
  id: number;
  nick: string;
  server: MonopolyServer;
  lobby: Lobby | null = null;

  constructor(id: number, nick: string, server: MonopolyServer) {
    this.id = id;
    this.nick = nick;
    this.server = server;
  }

  getData(): UserData {
    return {
      id: this.id,
      nick: this.nick,
    };
  }

  changeNick(nick: string): SystemResponse {
    this.nick = nick;
    return systemResponse(true, systemMessages['change nick'](this.nick));
  }

  createLobby(name: string, password: string | null = null) {
    return this.server.createLobby(this, name, password);
  }

  changeLobbyName(name: string): SystemResponse {
    if (!this.lobby) {
      return systemResponse(false, systemMessages['not room']);
    }
    return this.lobby.changeRoomName(this, name);
  }

  changeLobbyPassword(password: string) {
    if (!this.lobby) {
      return systemResponse(false, systemMessages['not room']);
    }
    return this.lobby.changeRoomPassword(this, password || null);
  }

  joinLobby(lobbyId: number, password: string | null = null): SystemResponse {
    if (this.lobby) {
      return systemResponse(false, systemMessages['already in room']);
    }

    const room = this.server.searchLobbyById(lobbyId);
    if (room) {
      return room.join(this, password);
    }
    return systemResponse(false, systemMessages['invalid room']);
  }

  leaveLobby(): SystemResponse {
    if (!this.lobby) {
      return systemResponse(false, systemMessages['not room']);
    }

    return this.lobby.leave(this);
  }

  startGame(): SystemResponse {
    if (!this.lobby) {
      return systemResponse(false, systemMessages['not room']);
    }

    return this.lobby.startGame(this);
  }

  roll(): SystemResponse {
    if (!this.lobby) {
      return systemResponse(false, systemMessages['not room']);
    }

    return this.lobby.game.roll(this);
  }

  // kickPlayer() {}
  // startGame() {}
  // roll() {}
  // move() {}
  // optionList() {}

}
