# Scalable Task Manager REST API with RBAC

A secure, clean, and modular RESTful API built using **Node.js, Express, and PostgreSQL (via Sequelize ORM)**, complete with a lightweight **Vanilla JS Frontend UI** client for rapid testing.

---

## 🚀 Architectural Overview

This project implements a classic **Client-Server Architecture**. The application enforces strict stateless security using JSON Web Tokens (JWT) and implements **Role-Based Access Control (RBAC)** to isolate data records between standard users and system administrators.



### Data Flow Model:
1. **Client Interaction**: The frontend UI triggers an asynchronous `fetch()` request containing user input and attaches a signed JWT in the `Authorization` header.
2. **Security Gatekeeper**: The Express routing tree passes requests through a custom `protect` middleware to decrypt the token token via `bcryptjs` and `jsonwebtoken`.
3. **Data Relational Isolation**: The system queries PostgreSQL tables through Sequelize mapping based on decoded token roles (`user` vs `admin`).

---

## 🛠️ Tech Stack & Dependency Mapping

* **Backend Environment**: Node.js & Express.js (High-performance asynchronous server execution)
* **Database Mapping Layer**: PostgreSQL & Sequelize ORM (Relational query handling and model syncing)
* **Authentication & Hashing**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` (Stateless session management and irreversible password cryptography)
* **Environment Safeguards**: `dotenv` (Local credential segregation) & `cors` (Cross-Origin resource permissions)

---

## ⚙️ Installation & Local Setup

### 1. Database Initialization
Ensure **PostgreSQL** is running on your machine. Open your terminal or `pgAdmin` and execute:
```sql
CREATE DATABASE task_db;

2. Environment Configuration
Create a .env file inside your backend/ directory:

Code snippet
DB_NAME=task_db
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
DB_HOST=localhost
JWT_SECRET=my_super_secret_key_123
PORT=5000
3. Execution Engines
Open a terminal workspace window, navigate to your backend folder, install dependencies, and start up the server:

Bash
cd backend
npm install
npm start
The ORM layer will automatically synchronize and build the relational user and task tables on startup.

4. Running the Frontend UI
Navigate to the frontend/ directory and open index.html directly inside any modern web browser to interact with the system.

📖 API Documentation Reference
All endpoints expect a JSON body payload and return a standardized JSON structure including a success status boolean flag.

🔐 Authentication Module (/api/v1/auth)
1. Register Account
Endpoint: POST /api/v1/auth/register

Body Payload:

JSON
{
  "name": "Alex",
  "email": "alex@test.com",
  "password": "securepassword123",
  "role": "user" 
}
Success Response (201 Created): Returns the user object record excluding the hashed password.

2. Authorize Session (Login)
Endpoint: POST /api/v1/auth/login

Body Payload:

JSON
{
  "email": "alex@test.com",
  "password": "securepassword123"
}
Success Response (200 OK): Returns the verified user context and an access token.

📝 Task Management Module (/api/v1/tasks)
Note: All endpoints below require an Authorization: Bearer <JWT_TOKEN> header.

3. Fetch Data Feed
Endpoint: GET /api/v1/tasks

RBAC Clearing Logic:

Standard User: Fetches only tasks created by their specific account ID.

Admin: Runs an internal SQL JOIN operation to fetch and display all system tasks across the database labeled with owner metadata.

Success Response (200 OK): Returns an array object under the data key.

4. Publish Task Record
Endpoint: POST /api/v1/tasks

Body Payload:

JSON
{
  "title": "Deploy infrastructure",
  "description": "Upload compiled backend modules to cloud node."
}
Success Response (201 Created): Returns the newly allocated table row object.

5. Purge Task Record
Endpoint: DELETE /api/v1/tasks/:id

Security Validation: Validates that the resource ID matches the current client's ID or the client holds an admin clearance role. Otherwise returns a 403 Forbidden status code.

Success Response (200 OK): { "success": true, "message": "Resource removed successfully" }
