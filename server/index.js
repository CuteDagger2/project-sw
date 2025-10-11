require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const reservationsRoutes = require('./routes/reservations');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple request logger to help verify incoming requests during smoke tests
app.use((req, res, next) => {
  try {
    console.log(new Date().toISOString(), req.method, req.url);
  } catch (e) {
    // ignore logging errors
  }
  next();
});

// Serve uploaded images
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Serve the front-end static files (project root)
const frontendDir = path.join(__dirname, '..');

// Make login page the root landing page (serve log.html)
app.get('/', (req, res) => {
  const loginPath = path.join(frontendDir, 'log.html');
  res.sendFile(loginPath);
});

// Static middleware (after the root route) — prevents express.static from serving index.html at '/'
app.use(express.static(frontendDir));

// Initialize DB and tables
initDb();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/reservations', reservationsRoutes);

// Simple healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true }));

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the process using that port or set a different PORT env var and retry.`);
    console.error('To find and kill the process on Windows (cmd.exe):');
    console.error('  netstat -ano | findstr :' + PORT);
    console.error('  taskkill /PID <pid> /F');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
