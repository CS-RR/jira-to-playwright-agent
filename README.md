# Jira to Playwright Agent

AI-assisted QA Automation Framework that transforms Jira tasks into Playwright automation tests using MCP workflows.

## 🚀 Overview

This project demonstrates an AI-assisted testing workflow where:

Jira Task → MCP Agent → Playwright Test Generation → Test Execution → Result Storage

The objective is to reduce manual test development by generating Playwright automation directly from Jira requirements.

---

## 🛠 Tech Stack

- Playwright
- TypeScript
- Jira
- MCP (Model Context Protocol)
- TodoMVC
- Swagger Petstore API

---

## 📁 Project Structure

```text
project/
│
├── tests/
├── results/
├── utils/
├── playwright.config.ts
├── package.json
└── README.md
```

---

## ✅ Automated Scenarios

### TodoMVC UI Automation

- Add a new task
- Complete a task
- Verify DOM class changes
- Filter tasks (All, Active, Completed)
- Verify localStorage persistence
- Verify page reload state persistence

### Swagger Petstore API Automation

- Create Pet (POST /pet)
- Retrieve Pet (GET /pet/{id})
- Update Pet Status (PUT /pet)
- Delete Pet (DELETE /pet/{id})

---

## 🔄 Workflow

### UI Automation Flow

```text
Jira User Story
      ↓
MCP Agent
      ↓
Generate Playwright UI Test
      ↓
TodoMVC Execution
      ↓
Results
```

### API Automation Flow

```text
Jira User Story
      ↓
MCP Agent
      ↓
Generate Playwright API Test
      ↓
Petstore Execution
      ↓
Results
```

---

## ▶️ Run Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test:

```bash
npx playwright test tests/QAI-13.spec.ts
```

---

## 🎯 Goal

Build an AI-assisted QA Automation Framework capable of converting Jira user stories and tasks into executable Playwright tests through MCP-driven workflows.
