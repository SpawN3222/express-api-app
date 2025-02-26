# Express API for Ticket Management

This is a **REST API backend** for handling ticket requests.  
The project is built using **Node.js, Express, and Prisma ORM**, with **SQLite3** as the default database.  
The frontend (**Vite + React**) is currently under development.  

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Prisma ORM, SQLite3  
- **Frontend** (WIP): Vite (SWC React + Axios)  

## 🚀 Features

- Create, update, and manage ticket requests  
- Support for bulk data operations (debug mode)  
- Pagination and filtering  
- Easy migration to **PostgreSQL** or other databases via Prisma  

---

## 📦 Installation

```sh
git clone https://github.com/your-repo-name.git
cd your-repo-name
npm install
```

---

## 🏗️ Database Setup

Prisma is used as the ORM. Before running the server, initialize the database:
```sh
npx prisma migrate dev --name init
```
This will create the `db.sqlite` file inside the `prisma/` directory.

---

## ▶️ Running the Server

To start the API server, use:
```sh
npm start
```
or with **nodemon** (for development):
```sh
npm run server
```

---

## 📡 API Endpoints

### 🆕 Create a New Ticket
```http
POST /tickets
```
**Body (JSON):**
```json
{
  "subject": "Issue Title",
  "message": "Description of the issue"
}
```

### 📋 Get All Tickets
```http
GET /tickets
```
**Optional query params:**
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `page`: Pagination page (default: 1)
- `limit`: Items per page (default: 100)

### 🚀 Update Ticket Status
**Mark as In Progress:**
```http
PATCH /tickets/:id/work
```
**Mark as Completed:**
```http
PATCH /tickets/:id/complete
```
**Cancel a Ticket:**
```http
PATCH /tickets/:id/cancel
```
```json
{
  "cancellationReason": "Reason for cancellation"
}
```

### ⚙️ Debug Endpoints
**Bulk Insert Test Data:**
```http
POST /tickets/big-data
```
```json
[
  { "subject": "Test 1", "message": "Message 1" },
  { "subject": "Test 2", "message": "Message 2" }
]
```
**Delete a Range of Tickets:**
```http
DELETE /tickets/big-data
```
```json
{
  "startId": 1,
  "endId": 50
}
```

---

## 🔄 Switching to PostgreSQL
By default, the project uses SQLite3, but Prisma makes it easy to switch:

1. Install PostgreSQL and update `prisma/schema.prisma`:
   ```prisma
   datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
   }
   ```
2. Set up a `.env` file:
  ```ini
  DATABASE_URL="postgresql://user:password@localhost:5432/database"
  ```
3. Apply migrations:
  ```sh
  npx prisma migrate dev --name init
  ```

---

## 🏗️ Frontend Development **(WIP)**

A **Vite + React** frontend is currently in active development.
Once completed, it will provide a user-friendly interface for interacting with the API.

For now, it is recommended to use **Postman**, Insomnia or another API testing tool.

