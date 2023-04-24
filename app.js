require('dotenv').config();
const express = require('express');
const db = require('./middlewares/db');
const authController = require('./routes/auth');
const chatController = require('./routes/chat');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authController);
app.use('/api/message', chatController);



app.listen(port, () => console.log(`Server running on port ${port}`));
