const express = require('express');
const router = express.Router();

// Hier importieren wir dein Datenmodell aus src/models/task.js
const Task = require('../models/task');

// 1. Alle Karten abrufen (GET /api/tasks)
router.get('/', (req, res) => {
    // Holt alle Tasks über die findAll-Methode deines Modells
    const allTasks = Task.findAll();
    res.json({ count: allTasks.length, tasks: allTasks });
});

// 2. Neue Karte erstellen (POST /api/tasks)
router.post('/', (req, res) => {
    // Wir übergeben den req.body direkt an die create-Funktion deines Modells
    // Dein Modell kümmert sich um die UUID, Priorität und Timestamps!
    const newTask = Task.create(req.body);
    
    res.status(201).json(newTask);
});

// 3. Karte verschieben / Status ändern (PATCH /api/tasks/:id/transition)
router.patch('/:id/transition', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Nutzt die transition-Funktion deines Modells (inkl. startedAt/completedAt Zeitstempeln!)
    const updatedTask = Task.transition(id, status);
    
    if (!updatedTask) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    
    res.json({ message: 'Status aktualisiert', task: updatedTask });
});

// 4. NEU: Karte löschen (DELETE /api/tasks/:id)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Ruft die neue remove-Funktion in deinem Modell auf
    const success = Task.remove(id);
    
    if (!success) {
        return res.status(404).json({ error: 'Task nicht gefunden und konnte nicht gelöscht werden' });
    }
    
    res.json({ message: 'Karte erfolgreich gelöscht' });
});

module.exports = router;