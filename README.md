# Scheduleer

A full-stack, Calendly-style meeting scheduling application built with a React frontend and Node.js/Express backend. 

## How to Run Locally

To run this application on your local machine, you will need to start both the Frontend and the Backend servers in **two separate terminal windows**.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A running MongoDB Database (Local or MongoDB Atlas)
- Google OAuth / Gmail credentials for the email service

---

### 1. Start the Backend (Node.js/Express)

1. Open a new terminal window and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Create a `.env` file in the `server` folder.
   - Add your variables (like `MONGO_URI`, `EMAIL_USER`, etc.). See `calendar-schedul/.env.example` if applicable.
4. Start the server:
   ```bash
   node index.js
   ```
   *The backend should now be running on `http://localhost:5000`*

---

### 2. Start the Frontend (React/Vite)

1. Open a **second, new terminal window** and navigate to the frontend directory:
   ```bash
   cd calendar-schedul
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running. Open the provided Local URL (usually `http://localhost:5173`) in your web browser!*