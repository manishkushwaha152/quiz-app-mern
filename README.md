# Quiz App - MERN Stack

![Quiz App Screenshot](https://via.placeholder.com/800x400?text=Quiz+App+Screenshot)  
*(Replace with actual screenshot)*

A full-stack quiz application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring admin dashboards, quiz creation, and real-time analytics.

## 🚀 Features

### Admin Features
- 📊 Dashboard with performance analytics
- ✏️ Create/edit/delete quizzes
- 📝 Manage questions and correct answers
- 📈 View student results and statistics

### User Features
- 🎯 Take interactive quizzes
- 📊 View instant results
- 🏆 Track progress over time

## 🛠 Tech Stack

**Frontend:**
- React.js
- Material-UI
- React Router
- Chart.js
- Axios

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- Mongoose

**Database:**
- MongoDB Atlas

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankitsharma38/quiz-app-mern.git
   cd quiz-app-mern
   ```

2. **Set up backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your MongoDB URI and JWT secret
   npm start
   ```

3. **Set up frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## ⚙️ Configuration

Create `.env` files with these variables:

**Backend (`.env`):**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**Frontend (`vite.config.js`):**
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

## 🌟 Live Demo
[View Live Demo](Add your deployment link here)

## 📝 API Endpoints

| Method | Endpoint                 | Description                  |
|--------|--------------------------|------------------------------|
| POST   | /api/auth/register       | User registration            |
| POST   | /api/auth/login          | User login                   |
| GET    | /api/quiz                | Get all quizzes              |
| POST   | /api/admin/quiz          | Create new quiz (Admin)      |
| PUT    | /api/admin/quiz/:id      | Update quiz (Admin)          |

## Quiz App - Project Overview

### Description:
A MERN stack (MongoDB, Express.js, React, Node.js) quiz application where:

- Admins can create, edit, and delete quizzes with multiple-choice questions.
- Students can take quizzes and view their scores.
- Admins can track performance via an analytics dashboard.

### 🚀 Key Features
- ✔ User Authentication (Login/Register)
- ✔ Admin Dashboard (Quiz management & analytics)
- ✔ Dynamic Quiz Creation (Add/remove questions & options)
- ✔ Real-time Results (Score tracking & leaderboard)
- ✔ Responsive UI (Mobile-friendly with Material-UI)
