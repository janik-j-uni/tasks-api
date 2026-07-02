const API_URL = 'http://localhost:3000/api/tasks';

// 1. Wenn die Seite lädt, rufen wir alle Tasks ab
document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        let tasks = [];
        // Wir prüfen einfach alle gängigen Daten-Verpackungen deines Backends:
        if (Array.isArray(data)) {
            tasks = data; // Falls das Backend direkt eine Liste schickt
        } else if (data.tasks) {
            tasks = data.tasks; // Falls es wie in Woche 7 im "tasks"-Feld steckt
        } else if (data.data) {
            tasks = data.data; // Falls es im "data"-Feld steckt
        }

        renderTasks(tasks);
    } catch (error) {
        console.error('Fehler beim Laden der API:', error);
    }
}

// 2. Tasks im HTML anzeigen
function renderTasks(tasks) {
    // Spalten leeren, bevor wir sie neu befüllen
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-in_progress').innerHTML = '';
    document.getElementById('list-done').innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true; // Macht die Karte verschiebbar
        card.dataset.id = task.id;

        card.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
        `;

        // Event Listener für Drag-and-Drop anheften
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // Status anpassen (Backlog wird zu To Do)
        let status = task.status;
        if (status === 'backlog') status = 'todo'; 
        
        const column = document.getElementById(`list-${status}`);
        if (column) {
            column.appendChild(card);
        }
    });
}

// 3. Neue Task erstellen (Button-Logik)
document.getElementById('addCardBtn').addEventListener('click', async () => {
    const title = prompt('Titel der neuen Aufgabe (min. 3 Zeichen):');
    
    // Validierung: Backend lehnt Titel unter 3 Zeichen ab!
    if (!title || title.trim().length < 3) {
        alert('Fehler: Der Titel muss mindestens 3 Zeichen lang sein!');
        return;
    }
    
    const description = prompt('Beschreibung (Optional):');

    const newTask = {
        title: title,
        description: description || '',
        priority: 'medium'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            fetchTasks(); // Board neu laden, damit die Karte erscheint
        } else {
            const errorData = await response.json();
            alert('Fehler vom Server: ' + (errorData.error || 'Unbekanntes Problem'));
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
    }
});

// ==========================================
// 4. DRAG AND DROP LOGIK
// ==========================================

let draggedCard = null;

function handleDragStart() {
    draggedCard = this;
    setTimeout(() => this.style.opacity = '0.5', 0);
}

function handleDragEnd() {
    setTimeout(() => {
        this.style.opacity = '1';
        draggedCard = null;
    }, 0);
}

// Die Spalten konfigurieren, damit sie Karten aufnehmen können
document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault(); // Notwendig, um den Drop zuzulassen
    });

    column.addEventListener('dragenter', e => {
        e.preventDefault();
        column.style.backgroundColor = '#d3d5d9'; // Visuelles Feedback beim Drüberziehen
    });

    column.addEventListener('dragleave', e => {
        column.style.backgroundColor = '#ebecf0'; // Feedback entfernen
    });

    column.addEventListener('drop', async e => {
        column.style.backgroundColor = '#ebecf0'; // Feedback entfernen
        if (!draggedCard) return;

        const newStatus = column.getAttribute('data-status');
        const list = column.querySelector('.card-list');
        
        // Karte im Frontend direkt in die neue Spalte verschieben
        list.appendChild(draggedCard);

        const taskId = draggedCard.dataset.id;
        
        // Änderung ans Backend senden (PATCH /transition)
        try {
            await fetch(`${API_URL}/${taskId}/transition`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Status:', error);
            alert('Status konnte nicht gespeichert werden!');
            fetchTasks(); // Bei Fehler das Board sicherheitshalber neu laden
        }
    });
});