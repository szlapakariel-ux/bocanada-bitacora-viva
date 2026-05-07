const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'logs.json');
const DEMO_FILE = path.join(__dirname, 'data', 'demo-data.json');
const FACILITATOR_PASS = process.env.FACILITATOR_PASS || 'bocanada21';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readLogs() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}

function writeLogs(logs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(logs, null, 2));
}

function readDemoData() {
  try { return JSON.parse(fs.readFileSync(DEMO_FILE, 'utf8')); }
  catch { return { participants: [], logs: [] }; }
}

// Login
app.post('/api/login', (req, res) => {
  const { name, role, pass } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Faltan datos' });
  if (role === 'facilitadora') {
    if (pass !== FACILITATOR_PASS) {
      return res.status(401).json({ error: 'Clave incorrecta' });
    }
  }
  const entry = { ts: new Date().toISOString(), name, role, action: 'login' };
  const logs = readLogs();
  logs.push(entry);
  writeLogs(logs);
  res.json({ ok: true, name, role });
});

// Log user action
app.post('/api/log', (req, res) => {
  const { name, role, need, card, action, registro, shared } = req.body;
  const entry = {
    ts: new Date().toISOString(),
    name: name || 'anónima',
    role: role || 'participante',
    need: need || null,
    card: card || null,
    action: action || null,
    registro: registro || null,
    shared: shared || false
  };
  const logs = readLogs();
  logs.push(entry);
  writeLogs(logs);
  res.json({ ok: true });
});

// Panel data for facilitadoras
app.get('/api/panel', (req, res) => {
  const pass = req.headers['x-facilitator-pass'];
  if (pass !== FACILITATOR_PASS) {
    return res.status(401).json({ error: 'No autorizada' });
  }

  const demo = readDemoData();
  const realLogs = readLogs().filter(l => l.role !== 'facilitadora' && l.action !== 'login');
  const allLogs = [...demo.logs, ...realLogs];

  const today = new Date().toISOString().slice(0, 10);

  // Merge real participants from logs into demo participants
  const realNames = [...new Set(realLogs.map(l => l.name))];
  const demoNames = demo.participants.map(p => p.name);
  const extraParticipants = realNames.filter(n => !demoNames.includes(n)).map(n => ({
    name: n,
    days: [1],
    lastActive: today,
    needs: realLogs.filter(l => l.name === n && l.need).map(l => l.need)
  }));
  const participants = [...demo.participants, ...extraParticipants];

  const totalParticipants = participants.length;
  const activeToday = participants.filter(p => p.lastActive === today).length
    + [...new Set(realLogs.filter(l => l.ts.startsWith(today)).map(l => l.name))].length;
  const neverEntered = participants.filter(p => !p.lastActive || p.days.length === 0);

  const needCounts = {};
  allLogs.forEach(l => {
    if (l.need) needCounts[l.need] = (needCounts[l.need] || 0) + 1;
  });

  const cardCounts = {};
  allLogs.forEach(l => {
    if (l.card) cardCounts[l.card] = (cardCounts[l.card] || 0) + 1;
  });

  const recentRegistros = allLogs
    .filter(l => l.registro)
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 5)
    .map(l => ({ name: l.name, registro: l.registro, ts: l.ts, need: l.need }));

  const recentActivity = allLogs
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 8)
    .map(l => ({ name: l.name, action: l.action, card: l.card, need: l.need, ts: l.ts }));

  const participantSummary = participants.map(p => {
    const pLogs = allLogs.filter(l => l.name === p.name);
    const lastNeed = pLogs.filter(l => l.need).slice(-1)[0];
    return {
      name: p.name,
      daysActive: p.days.length,
      lastActive: p.lastActive,
      lastNeed: lastNeed ? lastNeed.need : null,
      shared: pLogs.some(l => l.shared),
      hasRegistro: pLogs.some(l => l.registro),
      inactive: !p.lastActive || p.days.length === 0
    };
  });

  res.json({
    totalParticipants,
    activeToday: Math.min(activeToday, totalParticipants),
    neverEntered: neverEntered.map(p => p.name),
    needCounts,
    cardCounts,
    recentRegistros,
    recentActivity,
    participantSummary
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BOCANADA corriendo en http://localhost:${PORT}`);
});
