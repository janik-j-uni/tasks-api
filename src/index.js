const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const boardRouter = require('./routes/board'); // Neu!
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // <-- Genau hier einfügen!

// Routen registrieren
app.use('/api/tasks', tasksRouter);
app.use('/api/board', boardRouter); // Neu!

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Block 4 API running' });
});

// Error-Handler MUSS als letztes Middleware eingebunden werden!
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});