# Kanban Projektboard - 3Musketiere

Dies ist das finale Projekt des Moduls "Agiles Projektmanagement" (SS 2026). Ziel war die Entwicklung eines funktionsfähigen Kanban-Boards mit REST-API, Frontend-Integration und agilen Management-Methoden.

## 🚀 Features
- **REST-API**: CRUD-Operationen für Tasks (`POST`, `GET`, `PATCH`).
- **Frontend**: Dynamisches Kanban-Board mit Drag-and-Drop Funktionalität.
- **Workflow**: Status-Übergänge zwischen "To Do", "In Progress" und "Done".
- **Containerisierung**: Vollständig lauffähig via Docker & Docker-Compose.
- **CI/CD**: Automatisierte Pipelines via GitHub Actions.

## 🛠 Tech-Stack
- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **DevOps**: Docker, Docker-Compose, GitHub Actions
- **Testing**: Jest

## 📋 Sprint-Ergebnisse (Sprint 2)
Das Sprint-Ziel "Basis-CRUD für Cards vollständig implementieren und Drag-and-Drop ermöglichen" wurde erfolgreich erreicht.

| User Story | Status | Story Points |
| :--- | :--- | :--- |
| US-001: Card erstellen | ✅ Done | 5 |
| US-002: Cards in Spalten organisieren | ✅ Done | 5 |
| US-003: Drag-and-Drop zwischen Spalten | ✅ Done | 8 |
| US-004: WIP-Limit setzen | ✅ Done | 3 |
| US-005: Card löschen | 📝 Backlog | 2 |
| US-006: Card bearbeiten | 📝 Backlog | 3 |

## 🚀 Installation & Start
1. Repository klonen: `git clone <URL>`
2. Abhängigkeiten installieren: `npm install`
3. Starten (lokal): `npm run dev`
4. Starten (Docker): `docker-compose up --build`

## 📊 Agile Dokumentation
Screenshots des Jira-Backlogs und des aktiven Sprint-Boards sind im Ordner `/docs` oder im ZIP-Abgabearchiv zu finden. Die Retrospektive wurde als Sailboat-Retro durchgeführt und dokumentiert.
