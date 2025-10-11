const path = require('path');
const fs = require('fs');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.json');

let db = null;

const DEFAULTS = {
  users: [],
  events: [],
  reservations: [],
  lastIds: { users: 0, events: 0, reservations: 0 }
};

async function readFileJson(file) {
  try {
    const content = await fs.promises.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

async function writeFileJson(file, data) {
  const tmp = file + '.tmp';
  await fs.promises.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tmp, file);
}

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function initDb() {
  if (db) return db;
  ensureDirExists(DB_FILE);
  db = {
    data: null,
    read: async () => {
      const existing = await readFileJson(DB_FILE);
      if (existing) db.data = existing;
      if (!db.data) {
        db.data = JSON.parse(JSON.stringify(DEFAULTS));
        await writeFileJson(DB_FILE, db.data);
      }
    },
    write: async () => {
      if (!db || !db.data) throw new Error('DB not initialized');
      await writeFileJson(DB_FILE, db.data);
    }
  };
  return db;
}

function getDb() {
  if (!db) throw new Error('DB not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
