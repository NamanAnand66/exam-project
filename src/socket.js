import { io } from 'socket.io-client';


const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'
  : 'https://exam-project-r84y.onrender.com'; 

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});
