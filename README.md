# Stock Market Simulator

A web-based stock market simulator that allows users to track real stocks, manage virtual portfolios, and trade stocks using a virtual balance. The project consists of a **React frontend** and a **Node.js backend** that integrates with a real-time stock API.

## Features
- User authentication (JWT-based)
- Real-time stock data and price updates
- Virtual trading (buy/sell stocks)
- Portfolio tracking
- Stock details with historical performance charts
- Responsive UI

## Tech Stack
### Frontend (React)
- React with React Router
- Bootstrap for UI styling
- Axios for API calls

### Backend (Node.js, Express, MongoDB)
- Express.js framework
- MongoDB with Mongoose
- JWT authentication
- Axios for fetching real-time stock data

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Clone the Repository
```sh
git clone https://github.com/JAS-30/stock-market-simulator.git
cd stock-market-simulator
```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file inside the `backend` folder and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key
   PORT=5000
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm start
   ```

## Usage
1. Open `http://localhost:3000` in your browser.
2. Register or log in to access the simulator.
3. Search for stocks, view real-time data, and trade virtually.

## Preview
Below is a gallery showcasing screenshots of the app:

![Dashboard](path_to_screenshot_1)
![Stock Details](path_to_screenshot_2)
![Portfolio](path_to_screenshot_3)
![Trading View](path_to_screenshot_4)
