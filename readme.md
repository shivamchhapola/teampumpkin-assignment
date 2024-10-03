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

```bash
git clone https://github.com/shivamchhapola/your-repo-name.git
cd your-repo-name
2. Install Dependencies
Backend
Navigate to the backend folder and install dependencies:

bash
Copy code
cd backend
npm install
Frontend
Navigate to the frontend folder and install dependencies:

bash
Copy code
cd ../frontend
npm install
3. Set Up Environment Variables
Backend
Create a .env file in the backend directory and add the following:

bash
Copy code
# .env (backend)
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
Replace <username>, <password>, <cluster>, and <dbname> with your actual MongoDB vector URI details.
Frontend
Create a .env file in the frontend directory and add the following:

bash
Copy code
# .env (frontend)
VITE_BACKEND_URL=http://localhost:5000
4. Running the Application
Backend
From the backend directory, run the following command to start the Express server:

bash
Copy code
npm run dev
This will start the backend server on http://localhost:5000.

Frontend
From the frontend directory, run the following command to start the Vite development server:

bash
Copy code
npm run dev
This will start the frontend on http://localhost:3000.

5. Access the Application
Open your browser and navigate to http://localhost:3000 to access the frontend.
The backend API will be running at http://localhost:5000.
Building for Production
To build the frontend for production, run the following command:

bash
Copy code
npm run build
To start the backend in production mode:

bash
Copy code
npm start
Additional Notes
Ensure MongoDB is properly connected. You can use a local instance or MongoDB Atlas with the vector URI format.
For any issues, please refer to the logs in the terminal where the application is running.
```
