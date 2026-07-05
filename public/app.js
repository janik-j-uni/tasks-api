const API_URL = 'http://localhost:3000/api/tasks';

// 1. Wenn die Seite lädt, rufen wir alle Tasks ab
document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        let tasks = [];
        if (Array.isArray(data)) {
            tasks = data; 
        } else if (data.tasks) {
            tasks = data.tasks; 
        } else if (data.data) {
            tasks = data.data; 
        }

        renderTasks(tasks);
    } catch (error) {
        console.error('Fehler beim Laden der API:', error);
    }
}

// 2. Tasks im HTML anzeigen
function renderTasks(tasks) {
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-in_progress').innerHTML = '';
    document.getElementById('list-done').innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true; 
        card.dataset.id = task.id;

        // NEU: HTML um einen Lösch-Button (Klasse: delete-btn) erweitert
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 style="margin: 0;">${task.title}</h3>
                <button class="delete-btn" style="background: red; color: white; border: none; border-radius: 3px; cursor: pointer;">X</button>
            </div>
            <p>${task.description || ''}</p>
        `;

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // NEU: Event-Listener für den Lösch-Button anhängen
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            // Sicherheitsabfrage vor dem Löschen
            if (confirm(`Möchtest du die Karte "${task.title}" wirklich löschen?`)) {
                deleteTask(task.id);
            }
        });

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
            fetchTasks(); 
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

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault(); 
    });

    column.addEventListener('dragenter', e => {
        e.preventDefault();
        column.style.backgroundColor = '#d3d5d9'; 
    });

    column.addEventListener('dragleave', e => {
        column.style.backgroundColor = '#ebecf0'; 
    });

    column.addEventListener('drop', async e => {
        column.style.backgroundColor = '#ebecf0'; 
        if (!draggedCard) return;

        const newStatus = column.getAttribute('data-status');
        const list = column.querySelector('.card-list');
        
        list.appendChild(draggedCard);

        const taskId = draggedCard.dataset.id;
        
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
            fetchTasks(); 
        }
    });
});

// ==========================================
// 5. NEU: KARTE LÖSCHEN (API CALL)
// ==========================================
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks(); // Lade das Board nach erfolgreichem Löschen neu
        } else {
            const errorData = await response.json();
            alert('Fehler vom Server: ' + (errorData.error || 'Karte konnte nicht gelöscht werden'));
        }
    } catch (error) {
        console.error('Netzwerkfehler beim Löschen:', error);
        alert('Netzwerkfehler: Karte konnte nicht gelöscht werden.');
    }
}