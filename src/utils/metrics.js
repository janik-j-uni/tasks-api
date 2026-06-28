// Berechnet die Cycle Time (Zeit von 'in_progress' bis 'done') in Stunden
function calculateCycleTime(task) {
    if (task.status !== 'done') return null;
    if (!task.startedAt || !task.completedAt) return null;

    const startTime = new Date(task.startedAt).getTime();
    const endTime = new Date(task.completedAt).getTime();

    return (endTime - startTime) / (1000 * 60 * 60); // Millisekunden in Stunden umrechnen
}

// Berechnet die Lead Time (Gesamtzeit von Erstellung bis 'done') in Stunden
function calculateLeadTime(task) {
    if (task.status !== 'done') return null;
    if (!task.createdAt || !task.completedAt) return null;

    const startTime = new Date(task.createdAt).getTime();
    const endTime = new Date(task.completedAt).getTime();

    return (endTime - startTime) / (1000 * 60 * 60); // Millisekunden in Stunden umrechnen
}

// Berechnet den Durchsatz (Wie viele Tasks wurden in den letzten X Tagen fertig?)
function calculateThroughput(tasks, periodDays = 7) {
    const now = new Date().getTime();
    const cutoff = now - (periodDays * 24 * 60 * 60 * 1000);

    return tasks.filter(t => {
        return t.status === 'done' && t.completedAt && new Date(t.completedAt).getTime() >= cutoff;
    }).length;
}

// Hilfsfunktion für den Durchschnitt
function calculateAverage(array) {
    const validValues = array.filter(v => v !== null);
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return sum / validValues.length;
}

module.exports = {
    calculateCycleTime,
    calculateLeadTime,
    calculateThroughput,
    calculateAverage
};