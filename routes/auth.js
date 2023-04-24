const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username);
      const user = await User.findOne({ username });
  
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const newUser = new User({ username, password });
      await newUser.save();
  
      res.json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
