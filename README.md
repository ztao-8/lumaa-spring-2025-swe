# Full-Stack Coding Challenge

**Deadline**: Sunday, Feb 23th 11:59 pm PST

---

## Overview

Create a “Task Management” application with **React + TypeScript** (frontend), **Node.js** (or **Nest.js**) (backend), and **PostgreSQL** (database). The application should:

1. **Register** (sign up) and **Log in** (sign in) users.
2. After logging in, allow users to:
   - **View a list of tasks**.
   - **Create a new task**.
   - **Update an existing task** (e.g., mark complete, edit).
   - **Delete a task**.

Focus on **correctness**, **functionality**, and **code clarity** rather than visual design.  
This challenge is intended to be completed within ~3 hours, so keep solutions minimal yet functional.

---

## Start the project
### 1. Docker
You can use docker to imagration database without installing postgreSQL in your local machine
```
docker compose up -d
```

### 2. Backend (Nest.js + PostgreSQL)
create your .env file:
```
PORT=5001
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/taskdb
JWT_SECRET=your_jwt_secret_here
```
- `npm install` then `npm start` (or `npm run dev`) to run.

### 3. Frontend (React + TypeScript)
create your .env file:
```
REACT_APP_API_URL=http://localhost:5001
```

- `npm install` then `npm start` (or `npm run dev`) to run.

---

## Deliverables video
https://usfca.zoom.us/rec/share/RGRoiOIh_Lb7g8R2RFvn6KcbVNlibge0mWT_d2KweQufPQOkWiwMZz96vF2RpKlK.saRl-0w6v5RBT4Ah 
password: yi&b7+Qh


