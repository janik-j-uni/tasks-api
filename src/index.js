const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks'); // Neue Zeile!

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Routen registrieren
app.use('/api/tasks', tasksRouter); // Neue Zeile!

// Basis-Route für den API-Check
app.get('/', (req, res) => {
    res.json({ name: 'Tasks-API', version: '1.0.0' });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});