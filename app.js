require('dotenv').config();
const express = require('express');
const db = require('./middlewares/db');
const authController = require('./routes/auth');
const chatController = require('./routes/chat');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authController);
app.use('/api/message', chatController);
app.use(cors());

let users = {};

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log(`User ${users[socket.id]} disconnected`);
    delete users[socket.id];
  });

  socket.on('message', (data) => {
    console.log(`Received message from ${users[socket.id]}: ${data.message}`);
  
    // Send the message to all other clients except the sender
    socket.broadcast.emit('message', {
      sender: users[socket.id],
      message: data.message
    });
  });

  socket.on('username', (username) => {
    console.log(`User ${username} connected`);
    users[socket.id] = username;
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
