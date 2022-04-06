import Game from './game';
import Player from './player';

export default class Room {
  id: number;
  name: string;
  roomMaster: Player;
  game: Game;
  password: string | null;

  constructor(id: number, player: Player, name: string, password: string | null = null) {
    this.id = id;
    this.name = name;
    this.roomMaster = player;
    this.password = password;
    this.game = new Game();
  }
}
