// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const { Op } = require('sequelize');
const Item = require('./models/Item');
const User = require('./models/User'); // Import User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// 1. GET: Fetch user's items
app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const items = await Item.findAll({ where: { userId: req.user.userId } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// 2. POST: Add a new item
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { name, category, expiryDate } = req.body;
    const newItem = await Item.create({
      name,
      category,
      expiryDate,
      userId: req.user.userId
    });
    res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// 3. PUT: Update an item
app.put('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Item.update(req.body, {
      where: {
        id: id,
        userId: req.user.userId
      }
    });
    const updatedItem = await Item.findOne({
      where: {
        id: id,
        userId: req.user.userId
      }
    });
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// 4. DELETE: Remove an item
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Item.destroy({
      where: {
        id: id,
        userId: req.user.userId
      }
    });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// --- AUTH ROUTES ---

// 5. POST: Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      } 
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.json({ message: 'User registered successfully', userId: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 6. POST: Login user
app.post('/api/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginField = username || email;

    // Find user by username or email
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username: loginField },
          { email: loginField }
        ]
      } 
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- START SERVER & SYNC DB ---
// sync({ force: false }) keeps existing data. 
// Use { force: true } only if you want to DROP tables and restart.
sequelize.sync({ force: false }).then(() => {
  console.log(' Connected to MySQL Database');
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error(' Unable to connect to MySQL:', err);
});