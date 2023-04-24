const express = require('express');
const Chat = require('../models/chats');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app = express();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header not found' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};




router.post('/message', verifyToken, async (req, res) => {
  // The request will only get to this point if the user is authenticated
  const { senderId,receiverId, message } = req.body;
  try {
    const chat = new Chat({ senderId, receiverId, message });
    await chat.save();
    console.log(chat);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/message', verifyToken, async (req, res) => {
  // The request will only get to this point if the user is authenticated
  const { senderId, receiverId } = req.query;
  try {
    const chat = await Chat.find({ $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]}).sort({ timestamp: 'asc' });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;

