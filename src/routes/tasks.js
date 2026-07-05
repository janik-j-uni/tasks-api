const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { validateTask, validateTransition } = require('../middleware/validation');
// 1. Alle Karten abrufen (GET /api/tasks)
router.get('/', (req, res) => {
    const tasks = Task.findAll();
    res.json({ count: tasks.length, tasks: tasks });
});

// 2. Neue Karte erstellen (POST /api/tasks)
router.post('/', validateTask, (req, res) => {
    const newTask = Task.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority
    });

    res.status(201).json(newTask);
});

// 3. Karte verschieben / Status ändern (PATCH /api/tasks/:id/transition)
router.patch('/:id/transition', validateTransition, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const task = Task.transition(id, status);
    if (!task) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }

    res.json({ message: 'Status aktualisiert', task: task });
});

module.exports = router;