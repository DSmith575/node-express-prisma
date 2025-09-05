Express + Prisma + Docker Boilerplate

A modern boilerplate for building scalable Node.js applications with Express, Prisma, and Docker. Preconfigured with TypeScript, ESLint, Prettier, Jest, and database containerization so you can start coding immediately without the setup overhead.

---

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Testing](#testing)
- [Database (Docker)](#database-docker)
- [Quickstart (Using as Boilerplate)](#quickstart-using-as-boilerplate)
- [JSON Response Middleware](#json-response-middleware)
  - [Overview](#overview)
  - [How It Works](#how-it-works)
    - [CRUD Helpers](#crud-helpers)
    - [Error / Status Helpers](#error--status-helpers)
    - [Core Helper](#core-helper)
    - [Cheat Sheet](#cheat-sheet)
  - [Best Practices](#best-practices)
  - [Usage Example](#usage-example)

---

## 🚀 Features

⚡ Express.js – Minimal, fast, and flexible web framework.

🗄️ Prisma ORM – Type-safe database access and migrations.

🐳 Docker-ready – Local Postgres database with simple run/stop scripts.

📦 TypeScript – Strongly typed code with TSConfig paths.

🛠️ ESLint + Prettier – Code linting and formatting.

✅ Jest – Unit and integration testing.

🔄 Hot Reloading – Via Nodemon + ts-node in development.

---

## ⚙️ Setup
1. Clone the repo  
*change project name to your desired folder name*  
`git clone https://github.com/DSmith575/node-express-prisma.git project-name`  
`cd project-name`

2. Remove boilerplate git history  
`rm -rf .git`

3. Reinitialize git for your new project  
`git init`  
`git add .`  
`git commit -m "Init commit"`  
`git remote add origin https://github.com/username/new-repo.git`  
`git branch -M main`
`git push -u origin main`  

2. Install dependencies  
`npm install`

3. Setup environment variables  
`npm run env:copy`

**Then edit .env with your own values.**  

4. Start database (Docker)  
`npm run docker:run:dev`

5. Run Prisma generate  
`npm run prisma:generate`

6. Run Prisma Migrate  
`npm run prisma:migrate`

7. Seed Database if required  
`npm run seed`

6. Start development server  
`npm run dev`

---

## 🧪 Testing

### Unit testing
`npm test:unit`

### Integration testing
`npm test:integration`

Watch mode:
`npm run test:watch`

---
## 🐳 Database (Docker)

Run DB: `npm run docker:run:dev`

Stop DB: `npm run docker:stop:dev`

Remove DB container: `npm run docker:remove:dev`

*Default Postgres password:* **HelloWorld123** (change in scripts / .env).

---

## JSON Response Middleware

### Overview

The **JSON Response Middleware** extends the Express `Response` object with a set of helper methods for sending consistent JSON responses. It covers:

- **CRUD responses** (`create`, `read`, `update`, `delete`)  
- **List responses** (arrays of data)  
- **Error/status responses** (bad request, unauthorized, forbidden, not found)  

Each helper ensures:

1. The correct HTTP status code is sent.  
2. The response structure is consistent across your API.  
3. Optional custom messages can be provided for error/status helpers.

---

### How It Works

#### CRUD Helpers
- `res.jsonCreated(data)` → 201 Created  
- `res.jsonRead(data)` → 200 OK  
- `res.jsonUpdated(data)` → 200 OK  
- `res.jsonDeleted(message?)` → 200 OK (default: "Deleted successfully")  
- `res.jsonList(data)` → 200 OK (for arrays of data)  

#### Error / Status Helpers
- `res.jsonError(message?)` → 400 Bad Request  
- `res.jsonUnauthorized(message?)` → 401 Unauthorized  
- `res.jsonForbidden(message?)` → 403 Forbidden  
- `res.jsonNotFound(message?)` → 404 Not Found  

> You can optionally provide a **custom message** for all error/status helpers. If not provided, default messages are used.

#### Core Helper
- `res.jsonReturn(status, data)` → Send any custom status and data object.

---

### Cheat Sheet

| Helper | Default Status | Accepts Custom Message? | Example Call | Sample JSON Output |
|--------|----------------|------------------------|--------------|------------------|
| `res.jsonReturn(status, data)` | Custom | ❌ | `res.jsonReturn(202, { foo: 'bar' })` | `{ "statusCode": 202, "data": { "foo": "bar" } }` |
| `res.jsonCreated(data)` | 201 Created | ❌ | `res.jsonCreated({ id: 1, name: 'Test' })` | `{ "statusCode": 201, "data": { "id": 1, "name": "Test" } }` |
| `res.jsonRead(data)` | 200 OK | ❌ | `res.jsonRead(user)` | `{ "statusCode": 200, "data": { "id": 1, "name": "Alice" } }` |
| `res.jsonUpdated(data)` | 200 OK | ❌ | `res.jsonUpdated(updatedUser)` | `{ "statusCode": 200, "data": { "id": 1, "name": "Alice Updated" } }` |
| `res.jsonDeleted(message?)` | 200 OK | ✅ | `res.jsonDeleted()` | `{ "statusCode": 200, "data": { "message": "Deleted successfully" } }` |
| | | | `res.jsonDeleted('Removed item')` | `{ "statusCode": 200, "data": { "message": "Removed item" } }` |
| `res.jsonList(data)` | 200 OK | ❌ | `res.jsonList(users)` | `{ "statusCode": 200, "data": [ { "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" } ] }` |
| `res.jsonError(message?)` | 400 Bad Request | ✅ | `res.jsonError()` | `{ "statusCode": 400, "message": "Bad Request" }` |
| | | | `res.jsonError('Invalid input')` | `{ "statusCode": 400, "message": "Invalid input" }` |
| `res.jsonUnauthorized(message?)` | 401 Unauthorized | ✅ | `res.jsonUnauthorized()` | `{ "statusCode": 401, "message": "Unauthorized" }` |
| | | | `res.jsonUnauthorized('No token')` | `{ "statusCode": 401, "message": "No token" }` |
| `res.jsonForbidden(message?)` | 403 Forbidden | ✅ | `res.jsonForbidden()` | `{ "statusCode": 403, "message": "Forbidden" }` |
| | | | `res.jsonForbidden('Not allowed')` | `{ "statusCode": 403, "message": "Not allowed" }` |
| `res.jsonNotFound(message?)` | 404 Not Found | ✅ | `res.jsonNotFound()` | `{ "statusCode": 404, "message": "Not Found" }` |
| | | | `res.jsonNotFound('User not found')` | `{ "statusCode": 404, "message": "User not found" }` |

---

### Best Practices

1. **CRUD Responses**  
   - Create → Use `res.jsonCreated(data)` after successfully creating a resource.  
   - Read → Use `res.jsonRead(data)` when returning a single item or record.  
   - Update → Use `res.jsonUpdated(data)` after updating a resource.  
   - Delete → Use `res.jsonDeleted()` when a resource is deleted. Optionally, pass a custom message.  
   - List → Use `res.jsonList(dataArray)` when returning multiple items.  

2. **Error Responses**  
   - Client Errors → `res.jsonError('Custom message')` (400).  
   - Unauthorized → `res.jsonUnauthorized('Custom message')` (401).  
   - Forbidden → `res.jsonForbidden('Custom message')` (403).  
   - Not Found → `res.jsonNotFound('Custom message')` (404).  

3. **Custom Responses**  
   - Use `res.jsonReturn(status, data)` for scenarios that don’t fit standard helpers.  

4. **Optional Messages**  
   - Error/status helpers allow a custom message. If none is provided, a default message is returned.  

5. **Controller Pattern**  
   Always `return` after sending a response to prevent further code execution:

```ts
if (!test) {
  return res.jsonNotFound('Test not found');
}

res.jsonRead(test);
