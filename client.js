const socketIO = require('socket.io-client');



const socket = socketIO('http://localhost:3000/api/message/message');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('new-message', (chat) => {
  console.log(chat);
});