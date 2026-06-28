const { v4: uuidv4 } = require('uuid');

// Das simulierte In-Memory-Daten-Array
let tasks = [];

function create(data) {
    const newTask = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status: 'backlog', // Mögliche Werte: backlog, todo, in_progress, review, testing, done
        priority: data.priority || 'medium',
        assignee: data.assignee || null,
        tags: data.tags || [],
        storyPoints: data.storyPoints || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        statusHistory: [{ status: 'backlog', timestamp: new Date().toISOString() }]
    };
    tasks.push(newTask);
    return newTask;
}

function findAll() {
    return tasks;
}

function findById(id) {
    return tasks.find(t => t.id === id);
}

function transition(id, newStatus) {
    const task = findById(id);
    if (!task) return null;
    
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    task.statusHistory.push({ status: newStatus, timestamp: new Date().toISOString() });
    
    // Status-spezifische Timestamps setzen
    if (newStatus === 'in_progress' && !task.startedAt) {
        task.startedAt = new Date().toISOString();
    }
    if (newStatus === 'done' && !task.completedAt) {
        task.completedAt = new Date().toISOString();
    }
    
    return task;
}

module.exports = {
    create,
    findAll,
    findById,
    transition
};