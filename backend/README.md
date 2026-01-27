# Sweet Home Finder - Backend

This is the backend of the Sweet Home Finder project, built using Node.js, Express, and PostgreSQL. The backend handles user authentication, API requests, and database interactions.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)


## Requirements

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/en/download/) (version 14 or above)
- [PostgreSQL](https://www.postgresql.org/download/)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

## Installation

To set up the backend, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/cs-440-at-uic/440-Group-15-Fall-2024.git
    cd "Coding Project/Sweet_Home_Finder/backend"
    ```

2. **Install dependencies**:
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3. **Install nodemon (for development)**:
    Nodemon is used to automatically restart the server when file changes are detected.
    ```bash
    npm install nodemon --save-dev
    ```

4. **Install Axios**:
    Axios is used to make HTTP requests in the backend (if needed for external APIs):
    ```bash
    npm install axios
    ```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```PORT=5001
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sweet_home_finder
DB_HOST=localhost
DB_PORT=5432
```

Make sure to replace the placeholders with your actual database credentials.

## Running the Server

To start the backend server:

1. Ensure PostgreSQL is running and the database is set up.
2. Start the server:
    ```bash
    npm start
    ```
    Or for development with auto-reloading (using nodemon):
    ```bash
    npm run dev
    ```

The server should now be running at `http://localhost:5001`.

## API Endpoints

- `POST /api/signin` - Sign up a new user.
- `POST /api/login` - Log in a user.
- `GET /api/users` - Retrieve all users (for testing purposes).

---

## Database Setup

1. Make sure PostgreSQL is installed and running.
2. Create the database:
    ```bash
    createdb sweet_home_finder
    ```
3. Before running the frontend, ensure that your database is set up correctly with Sequelize migrations.

Install Sequelize CLI: (if not already installed)

 ```bash
   npm install --save sequelize-cli
```
```
   Configure Sequelize: Ensure your config/config.json (or .env file) is correctly set up for your database.
 ```
4. Run Migrations: Once configured, run the migrations to set up the database schema:
```bash
   npx sequelize-cli db:migrate
 ```


