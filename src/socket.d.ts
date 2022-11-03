interface UserData {
  id: number;
  nick: string;
}

interface LobbyData {
  id: number;
  name: string;
  users: Array<PublicUserData>;
  hasPassword: boolean;
  masterId: number;
  state: 'creating' | 'ingame';
}

interface PublicUserData {
  id: number;
  nick: string;
}

interface PublicLobbyData {
  id: number;
  name: string;
  users: Array<PublicUserData>;
  hasPassword: boolean;
  masterId: number;
  state: 'creating' | 'ingame';
}

interface ServerData {
  users: Array<PublicUserData>;
  lobbies: Array<PublicLobbyData>;
}

interface LocalData {
  online: boolean;
}

interface ServerToClientEvents {
  'fetch user': (userData: UserData) => void;
  'fetch server': (serverData: ServerData) => void;
  'fetch lobby': (lobbyData: LobbyData | undefined) => void;
}

interface ClientToServerEvents {
  'create lobby': (name: string, password: string) => void;
  'change nick': (nick: string) => void;
  'join lobby': (roomId: number, password: string) => void;
  'start game': () => void;
  'leave lobby': () => void;
}

interface InterServerEvents {
  ping: () => void;
}
