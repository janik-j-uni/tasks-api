const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { validateTransition } = require('../middleware/validation');

// GET /api/tasks - Alle Tasks abrufen
router.get('/', (req, res) => {
    const tasks = Task.findAll();
    res.json(tasks);
});

// GET /api/tasks/:id - Einzelne Task abrufen
router.get('/:id', (req, res) => {
    const task = Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    res.json(task);
});

// POST /api/tasks - Neue Task erstellen
router.post('/', (req, res) => {
    const { title, description, priority, assignee, tags, storyPoints } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Titel ist erforderlich' });
    }

    const newTask = Task.create({ title, description, priority, assignee, tags, storyPoints });
    res.status(201).json(newTask);
});

// PATCH /api/tasks/:id/transition - Status ändern mit KANBAN-Validierung
router.patch('/:id/transition', validateTransition, (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const updatedTask = Task.transition(id, newStatus);
    res.json({ 
        message: `Task zu '${newStatus}' übergegangen`, 
        task: updatedTask 
    });
});

module.exports = router;