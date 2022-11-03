import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import MonopolyServer from './monopoly/server';
import User from './monopoly/user';

interface SocketData {
  user: User;
  roomId: string;
}

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const port = 8000;

const server = new MonopolyServer();

io.on('connection', (socket) => {
  socket.data.user = server.createUser();
  io.emit('fetch server', server.getData());
  socket.emit('fetch user', socket.data.user.getData());

  socket.on('change nick', (nick) => {
    if (!socket.data.user) return;
    console.log(socket.data.user.changeNick(nick));
    io.emit('fetch server', server.getData());
    socket.emit('fetch user', socket.data.user.getData());
  });

  socket.on('create lobby', (name, password) => {
    if (!socket.data.user) return;
    const result = socket.data.user.createLobby(name, password);
    console.log(result);
    if (result.success && socket.data.user.lobby) {
      socket.data.roomId = `lobby${socket.data.user.lobby.id}`;
      socket.join(socket.data.roomId);
      io.emit('fetch server', server.getData());
      io.to(socket.data.roomId).emit('fetch lobby', socket.data.user.lobby.getData());
    }
  });

  socket.on('join lobby', (lobbyId, password) => {
    if (!socket.data.user) return;
    const result = socket.data.user.joinLobby(lobbyId, password);
    console.log(result);
    if (result.success) {
      socket.data.roomId = `lobby${lobbyId}`;
      socket.join(socket.data.roomId);
      io.emit('fetch server', server.getData());
      if (socket.data.user.lobby) {
        io.to(socket.data.roomId).emit('fetch lobby', socket.data.user.lobby.getData());
      } else {
        console.warn('SOMETHING WENT WRONG');
      }
    }
  });

  socket.on('start game', () => {
    if (!socket.data.user || !socket.data.roomId || !socket.data.user.lobby) return;
    const result = socket.data.user.startGame();
    console.log(result);
    if (result.success) {
      io.to(socket.data.roomId).emit('fetch lobby', socket.data.user.lobby.getData());
    }
  });

  socket.on('disconnect', () => {
    console.log(socket.data.user?.leaveLobby());
  });

  socket.on('leave lobby', () => {
    if (!socket.data.user || !socket.data.user.lobby || !socket.data.roomId) return;
    const { lobby } = socket.data.user;
    const result = socket.data.user.leaveLobby();
    console.log(result);
    if (result.success) {
      socket.leave(socket.data.roomId);
      io.to(socket.data.roomId).emit('fetch lobby', lobby.getData());
      delete socket.data.roomId;
      socket.emit('fetch lobby', undefined);
    }
  });

});

httpServer.listen(port, () => {
  console.log(`Monopoly server port ${port}.`);
});
