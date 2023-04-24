require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const db = require('./middlewares/db');
const authController = require('./routes/auth');
const chatController = require('./routes/chat');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authController);
app.use('/api/message', chatController);


const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('A user connected');
  });
  

app.listen(port, () => console.log(`Server running on port ${port}`));
