const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET /api/tasks - Alle Tasks abrufen
router.get('/', (req, res) => {
    const { status, assignee } = req.query;
    let tasks = Task.findAll();
    if (status) tasks = tasks.filter(t => t.status === status);
    if (assignee) tasks = tasks.filter(t => t.assignee === assignee);
    res.json({ count: tasks.length, tasks });
});

// POST /api/tasks - Neuen Task anlegen
router.post('/', (req, res) => {
    const { title, description, priority, assignee } = req.body;
    if (!title) return res.status(400).json({ error: 'Titel ist erforderlich' });
    const newTask = Task.create({ title, description, priority, assignee });
    res.status(201).json(newTask);
});

// PATCH /api/tasks/:id/transition - Status wechseln (Neu!)
router.patch('/:id/transition', (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
        return res.status(400).json({ error: 'Status erforderlich' });
    }

    const task = Task.findById(id);
    if (!task) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }

    // Hier führen wir den Statusübergang durch
    const updatedTask = Task.transition(id, newStatus);
    res.json({ 
        message: `Task zu '${newStatus}' übergegangen`, 
        task: updatedTask 
    });
});

module.exports = router;