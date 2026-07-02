# Tasks-API – Agile Projektmanagement API (Woche 7-9)

Dieses Repository enthält die REST-API für unser agiles Kanban-Task-Board, entwickelt im Rahmen des Moduls "Agiles Projektmanagement" im Sommersemester 2026.

## 🚀 Features & Live-Demo (Woche 9)

Im Rahmen des Sprint-Abschlusses unterstützt die API folgende via `curl` testbare Kernfunktionen:

* **Jira Kanban-Board Integration:** Die Statusstrukturen spiegeln unser Jira-Board wider.
* **POST /api/tasks:** Neue Tasks live anlegen.
* **PATCH /api/tasks/:id/transition:** Task-Status live wechseln (mit Kanban-Validierung).
* **GET /api/board/metrics:** Automatische Berechnung von *Cycle Time*, *Lead Time*, *Throughput* und *WIP-Limits*.
* **Docker Containerisierung:** Die API ist vollständig containerisiert und läuft isoliert im Docker-Container.
* **GitHub Actions (CI/CD):** Jeder Push triggert eine automatisierte Pipeline, die für eine hohe Code-Qualität (wenig Linting-Fehler) und erfolgreiche Build-Runs sorgt.

## 🛠️ Tech-Stack

* **Backend:** Node.js, Express, JavaScript (ES6)
* **DevOps & QA:** Docker, Docker Compose, GitHub Actions, ESLint, Jest
