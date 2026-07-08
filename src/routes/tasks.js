const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { validateTask, validateTransition } = require('../middleware/validation');

// 1. Alle Karten abrufen (GET /api/tasks)
router.get('/', (req, res) => {
    // 1. Erstmal alle Tasks holen
    let tasks = Task.findAll();

    // 2. Schauen, ob Query-Parameter in der URL stehen
    const { status, assignee, title } = req.query;

    // 3. Die Liste filtern, falls Parameter mitgeschickt wurden
    if (status) {
        tasks = tasks.filter(t => t.status === status);
    }
    if (assignee) {
        tasks = tasks.filter(t => t.assignee === assignee);
    }
    if (title) {
        // Filtert nach dem exakten Titel
        tasks = tasks.filter(t => t.title === title);
    }

    // 4. Die gefilterte Liste zurückgeben
    res.json({ count: tasks.length, tasks: tasks });
});

// 2. Neue Karte erstellen (POST /api/tasks)
router.post('/', validateTask, (req, res) => {
    const newTask = Task.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        assignee: req.body.assignee,       // NEU
        tags: req.body.tags,               // NEU
        storyPoints: req.body.storyPoints  // NEU
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

// 4. Karte komplett aktualisieren (PUT /api/tasks/:id) <-- NEU HINZUGEFÜGT
router.put('/:id', (req, res) => {
    const { id } = req.params;
    
    const updatedTask = Task.update(id, req.body);

    if (!updatedTask) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }

    res.json({ message: 'Task erfolgreich aktualisiert', task: updatedTask });
});

// 5. Karte löschen (DELETE /api/tasks/:id)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const success = Task.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Task nicht gefunden und konnte nicht gelöscht werden' });
    }

    res.json({ message: 'Karte erfolgreich gelöscht' });
});

module.exports = router;