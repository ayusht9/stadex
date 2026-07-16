const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-Memory API Cache
const apiCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchCachedExternalData(endpoint) {
  if (apiCache.has(endpoint)) {
    const cached = apiCache.get(endpoint);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // Use global fetch
  const response = await fetch(`https://worldcup26.ir/get/${endpoint}`);
  if (!response.ok) throw new Error('API fetch failed');
  const data = await response.json();

  apiCache.set(endpoint, {
    timestamp: Date.now(),
    data: data
  });

  return data;
}

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create users table and seed it
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating users table', err.message);
      } else {
        // Seed users if none exist
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (err) return;
          if (row.count === 0) {
            const insert = 'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)';
            db.run(insert, ['Demo Fan', 'fan@fifa.com', 'password123', 'Fan']);
            db.run(insert, ['Demo Staff', 'staff@fifa.com', 'password123', 'Staff']);
            console.log('Seeded database with sample users (fan@fifa.com and staff@fifa.com).');
          }
        });
      }
    });
  }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ user: row });
  });
});

// Register Endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const insert = 'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)';
  db.run(insert, [name, email, password, role], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      user: {
        id: this.lastID,
        name,
        email,
        role
      }
    });
  });
});

// Mock Data for 2026 World Cup
  const MOCK_LIVE_MATCHES = [
    { id: 1, home: 'USA', away: 'Wales', homeScore: 2, awayScore: 1, minute: '75\'', status: 'live', stadium: 'MetLife Stadium' },
    { id: 2, home: 'Mexico', away: 'Poland', homeScore: 0, awayScore: 0, minute: '45\'', status: 'halftime', stadium: 'Azteca' }
  ];

  const MOCK_HISTORY_MATCHES = [
    { id: 3, home: 'Canada', away: 'Morocco', homeScore: 1, awayScore: 3, date: '2026-06-15', status: 'finished' },
    { id: 4, home: 'Brazil', away: 'Serbia', homeScore: 2, awayScore: 0, date: '2026-06-14', status: 'finished' }
  ];

  const MOCK_STANDINGS = [
    {
      group: 'Group A', teams: [
        { name: 'USA', played: 2, won: 1, drawn: 1, lost: 0, points: 4 },
        { name: 'Wales', played: 2, won: 1, drawn: 0, lost: 1, points: 3 },
        { name: 'Senegal', played: 2, won: 1, drawn: 0, lost: 1, points: 3 },
        { name: 'Iran', played: 2, won: 0, drawn: 1, lost: 1, points: 1 }
      ]
    }
  ];

  // Matches Endpoints
  app.get('/api/matches/live', (req, res) => {
    res.json(MOCK_LIVE_MATCHES);
  });

  app.get('/api/matches/history', (req, res) => {
    res.json(MOCK_HISTORY_MATCHES);
  });

  app.get('/api/standings', (req, res) => {
    res.json(MOCK_STANDINGS);
  });

  // External API Proxy with Cache
  app.get('/api/worldcup/:endpoint', async (req, res) => {
    try {
      const validEndpoints = ['stadiums', 'games', 'teams', 'groups'];
      if (!validEndpoints.includes(req.params.endpoint)) {
        return res.status(404).json({ error: 'Endpoint not supported' });
      }
      const data = await fetchCachedExternalData(req.params.endpoint);
      res.json(data);
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  if (require.main === module) {
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  }

  module.exports = app;
