const Task = require('../models/task'); // Ganz oben laden!

function validateTask(req, res, next) {
    const { title, priority } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            error: 'Titel ist erforderlich',
            received: { title }
        });
    }

    if (title.length < 3) {
        return res.status(400).json({
            error: 'Titel muss mindestens 3 Zeichen lang sein'
        });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
            error: 'Priority muss einer von: low, medium, high sein',
            received: priority
        });
    }

    next();
}

function validateTransition(req, res, next) {
    const { status: newStatus } = req.body;
    const { id } = req.params;

    const task = Task.findById(id);
    if (!task) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
    }

    // Definierte erlaubte Übergänge im Kanban-System
    const allowedTransitions = {
        'backlog': ['todo'],
        'todo': ['in_progress', 'backlog'],
        'in_progress': ['review', 'todo'],
        'review': ['testing', 'in_progress'],
        'testing': ['done', 'review'],
        'done': []
    };

    const currentStatus = task.status || 'backlog';

    // Falls der Status sich gar nicht ändert, einfach weitergehen
    if (currentStatus === newStatus) {
        return next();
    }

    // Prüfen, ob der Sprung erlaubt ist
    if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
        return res.status(400).json({
            error: `Ungültiger Statusübergang von '${currentStatus}' zu '${newStatus}'`
        });
    }

    next();
}

module.exports = { validateTask, validateTransition };