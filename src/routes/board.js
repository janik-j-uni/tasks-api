const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { 
    calculateCycleTime, 
    calculateLeadTime, 
    calculateThroughput, 
    calculateAverage 
} = require('../utils/metrics');

// GET /api/board - Gibt alle Tasks nach Status gruppiert zurück
router.get('/', (req, res) => {
    const tasks = Task.findAll();
    const statuses = ['backlog', 'todo', 'in_progress', 'review', 'testing', 'done'];
    const board = {};

    statuses.forEach(s => {
        board[s] = tasks.filter(t => t.status === s);
    });

    const counts = {};
    statuses.forEach(s => {
        counts[s] = board[s].length;
    });

    res.json({ board, counts });
});

// GET /api/board/metrics - Berechnet die agilen Team-Kennzahlen
router.get('/metrics', (req, res) => {
    const tasks = Task.findAll();
    const completedTasks = tasks.filter(t => t.status === 'done');
    const currentWip = tasks.filter(t => ['in_progress', 'review', 'testing'].includes(t.status)).length;

    const metrics = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTasks: tasks.length,
            completedTasks: completedTasks.length,
            wipCurrent: currentWip
        },
        metrics: {
            averageCycleTime: calculateAverage(tasks.map(calculateCycleTime)),
            averageLeadTime: calculateAverage(tasks.map(calculateLeadTime)),
            throughput: calculateThroughput(tasks),
            wipCurrent: currentWip
        }
    };

    res.json(metrics);
});

module.exports = router;