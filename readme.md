# Speedo - TeamPumpkin

Built using Vite + Typescript React along with Tailwing for Frontend and Express, Mongoose backend

## Features

- Frontend: Vite React with Typescript and TailwindCSS
- Backend: Express, Mongoose
- Database: MongoDB

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v14.x or higher)

- npm or yarn
- MongoDB

## Setup

### 1. Clone the repository

```
git clone https://github.com/shivamchhapola/teampumpkin-assignment.git
cd teampumpkin-assignment
```

### 2. Install Dependencies

#### Backend

Navigate to the backend folder and install dependencies:

```
cd backend
npm install
```

#### Frontend

Navigate to the frontend folder and install dependencies:

```
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the backend directory and add the following:

#### .env

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

`Replace <username>, <password>, <cluster>, and <dbname> with your actual MongoDB vector URI details.`

`If you change ports make sure to change "BackendUrl" in config.ts in frontend/src to your correct url`

### 4. Running the Application

#### Backend

From the backend directory, run the following command to start the Express server:

```
npm start
```

`This will start the backend server on http://localhost:3000.`

#### Frontend

From the frontend directory, run the following command to start the Vite development server:

```
npm run dev
```

`This will start the frontend on http://localhost:5173.`
