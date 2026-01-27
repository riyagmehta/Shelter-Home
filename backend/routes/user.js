const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');


const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: '90d', 
  });
};

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']  // Specify which attributes to return
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/users/:userId', async (req, res) => {
    console.log('Fetching user details');
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email'] // You can adjust the attributes you need
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({
            id: user.id, 
            username: user.username,
            email: user.email,
            token: generateToken(user.id) 
        });
    } catch (error) {
        console.error("Signup error: ", error);
        res.status(500).json({ error: error.message });
    }
});




router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        res.json({
            id: user.id, 
            username: user.username,
            email: user.email,
            token: generateToken(user.id) 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
