import { GameResponse } from './game';
import Player from './player';
import Room from './room';

const systemMessages = {
  'lobby full': 'Can\'t create new rooms, the lobby is full',
  'room created': 'Room created successfully',
};

export default class Lobby {
  rooms: Array<Room> = [];
  maxRooms = 40;

  response(success: boolean, message: string): GameResponse {
    return { success, message };
  }

  createRoom(player: Player, roomName: string, password: string | null = null): GameResponse {
    if (this.rooms.length >= this.maxRooms) {
      return this.response(false, systemMessages['lobby full']);
    }
    const roomId = this.getNewRoomId();
    this.rooms.push(new Room(roomId, player, roomName, password));
    return this.response(true, systemMessages['room created']);
  }

  getNewRoomId(): number {
    if (this.rooms.length === 0) {
      return 1;
    }

    const lastId = this.rooms[this.rooms.length - 1].id;
    return lastId + 1;
  }
}
