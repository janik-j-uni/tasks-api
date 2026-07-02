const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Unsere temporäre "Datenbank" im Arbeitsspeicher
let tasks = [];

// 1. Alle Karten abrufen (GET /api/tasks)
router.get('/', (req, res) => {
    res.json({ count: tasks.length, tasks: tasks });
});

// 2. Neue Karte erstellen (POST /api/tasks)
router.post('/', (req, res) => {
    const newTask = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description || '',
        status: 'todo', // Jede neue Karte startet in "To Do"
        priority: req.body.priority || 'medium'
    };
    
    tasks.push(newTask); // Karte in unsere Liste speichern
    res.status(201).json(newTask);
});

// 3. Karte verschieben / Status ändern (PATCH /api/tasks/:id/transition)
router.patch('/:id/transition', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    
    task.status = status; // Status aktualisieren (z.B. von "todo" auf "in_progress")
    res.json({ message: 'Status aktualisiert', task: task });
});

module.exports = router;