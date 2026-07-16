const express = require('express');
const cors = require('cors');
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

// In-Memory Database for Users
let users = [
  { id: 1, name: 'Demo Fan', email: 'fan@fifa.com', password: 'password123', role: 'Fan' },
  { id: 2, name: 'Demo Staff', email: 'staff@fifa.com', password: 'password123', role: 'Staff' }
];
let nextUserId = 3;

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Register Endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const newUser = { id: nextUserId++, name, email, password, role };
  users.push(newUser);
  
  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
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
    // Serve static files from the React build
    app.use(express.static(path.join(__dirname, '../dist')));

    // Catch-all route to serve index.html for client-side routing
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  }

  module.exports = app;
