import Lobby from './monopoly/server';

const lobby = new Lobby();
const shocker = lobby.createUser('Shocker');
const krap = lobby.createUser('Krap');

shocker.createLobby('chill and waifus', 'pico');
lobby.log();
shocker.lobby?.log();
console.log(krap.joinLobby(1, 'pico'));
shocker.lobby?.log();

console.log(shocker.startGame());
console.log(shocker.roll());
