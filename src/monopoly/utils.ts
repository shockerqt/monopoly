export function systemResponse(success: boolean, message: string): SystemResponse {
  return { success, message };
}

export const systemMessages = {
  // init
  'already init': 'The game is already initialized',
  'init success': 'The game was initialized succesfully',
  'change nick': (nick: string) => `Nick changed to ${nick}`,

  // join
  'join success': (playerNick: string) => `${playerNick} joined the game`,
  'already joined': (playerNick: string) => `${playerNick} is already in the game`,
  'game full': 'The game is full',

  // leave
  'not in game': (playerNick: string) => `${playerNick} is not in this game`,
  'lobby full': 'Can\'t create new rooms, the lobby is full',
  'room created': 'Room created successfully',

  'name changed': (name: string) => `Room name changed to '${name}'`,
  'not master': 'You are not the room master',
  'not room': 'You are not in a room',
  'password changed': 'Password changed successfully',
  'already in room': 'You are currently in a room',
  'wrong password': 'Invalid password',
  'invalid room': 'The room doesn\'t exist',
  'leave success': 'You left the room',
  'not turn': 'Is not your turn',
  'not expected': 'NOT EXPECTED BEHAVIOUR, FIX IT',
  'can not roll': 'Can\'t roll right now',
  'rolled': (n1: number, n2: number) => `Rolled ${n1} and ${n2}`,
};
