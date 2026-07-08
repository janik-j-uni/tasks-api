const fs = require('fs');
const path = require('path');
const { randomUUID: uuidv4 } = require('crypto');

// 1. Pfad zur JSON-Datei festlegen
const dataFile = path.join(__dirname, '..', '..', 'data', 'tasks.json');

// 2. Leeres Array initialisieren (Wichtig: Vor dem Einlesen!)
let tasks = [];

// 3. Beim Serverstart prüfen, ob schon Daten existieren, und diese laden
if (fs.existsSync(dataFile)) {
    try {
        const rawData = fs.readFileSync(dataFile, 'utf-8');
        tasks = JSON.parse(rawData);
    } catch (e) {
        console.error("Fehler beim Lesen der JSON-Datei:", e);
        tasks = [];
    }
}

// 4. Zentrale Hilfsfunktion zum Speichern auf die Festplatte
function saveTasks() {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
    } catch (e) {
        console.error("Fehler beim Schreiben der JSON-Datei:", e);
    }
}

// --- CRUD & KANBAN FUNKTIONEN ---

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
    
    saveTasks(); // SICHERUNG: Speichern nach dem Erstellen
    
    return newTask;
}

function findAll() {
    return tasks;
}

function findById(id) {
    return tasks.find(t => t.id === id);
}
// NEU: Die Update-Funktion für den PUT-Request
function update(id, data) {
    const task = findById(id);
    if (!task) return null;
    
    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.assignee !== undefined) task.assignee = data.assignee;
    if (data.tags !== undefined) task.tags = data.tags;
    if (data.storyPoints !== undefined) task.storyPoints = data.storyPoints;
    
    task.updatedAt = new Date().toISOString();
    
    saveTasks();
    return task;
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
    
    saveTasks(); // SICHERUNG: Speichern nach dem Verschieben
    
    return task;
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    
    saveTasks(); // SICHERUNG: Speichern nach dem Löschen
    
    return true;
}

module.exports = {
    update,
    create,
    findAll,
    findById,
    transition,
    remove
};