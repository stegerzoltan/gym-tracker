# Gym Tracker - Full Stack Application

A modern full-stack gym training tracker application built with React, Node.js/Express, and MongoDB.

## 🎯 Features

- **User Authentication**: Secure registration and login with JWT
- **Workout Tracking**: Log and manage your gym workouts
- **Exercise Details**: Track exercises with sets, reps, and weight
- **Workout History**: View all past workouts and progress
- **Responsive Design**: Mobile-friendly interface
- **REST API**: Complete backend API for workout management

## 🎯 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Workout Tracking**: Create, view, update, and delete workout sessions
- **Exercise Library**: Comprehensive database of exercises with search and filtering
  - Filter by muscle group, category, difficulty
  - Pre-loaded with 10+ default exercises
  - Create custom exercises
- **Detailed Exercise Logging**: Track sets, reps, weight for each exercise

### Advanced Features
- **Body Measurements Tracker**: Monitor weight, body fat %, and body measurements over time
  - Visual progress charts with Chart.js
  - Track multiple body metrics (chest, waist, hips, biceps, thighs)
  - Historical data visualization

- **Goals & Achievements**: Set and track fitness goals
  - Strength goals, weight goals, workout frequency
  - Visual progress bars
  - Automatic completion detection
  - Deadline tracking

- **Analytics Dashboard**: Comprehensive workout statistics
  - Total workouts and duration
  - Workout frequency by month (bar charts)
  - Current workout streak tracker
  - Average workout duration
  - Total volume lifted calculations

- **Workout Templates**: Save and reuse favorite workout routines (backend ready)
- **Responsive Design**: Beautiful gradient UI that works on all devices
- **Data Visualization**: Interactive charts powered by Chart.js

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Chart.js** & react-chartjs-2 for data visualization
- **CSS** for styling

## 📦 Project Structure

```
gym-tracker/
├── backend/
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── server.ts     # Express app entry point
│   ├── config/           # Configuration files
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── services/     # API service layer
│   │   ├── App.tsx       # Main component
│   │   └── index.tsx     # React entry point
│   ├── public/           # Static files
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from example:

```bash
cp .env.example .env
```

4. Configure environment variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gym-tracker
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

5. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from example:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Workouts

- `GET /api/workouts` - Get all workouts (requires auth)
- `POST /api/workouts` - Create new workout (requires auth)
- `GET /api/workouts/:id` - Get specific workout (requires auth)
- `PUT /api/workouts/:id` - Update workout (requires auth)
- `DELETE /api/workouts/:id` - Delete workout (requires auth)

## 🔐 Authentication

The application uses JWT tokens for authentication. After login/registration, the token is stored in localStorage and automatically added to all API requests.

## 📝 Example Usage

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Create Workout

```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Chest Day",
    "date": "2024-02-03",
    "duration": 60,
    "exercises": [
      {
        "name": "Bench Press",
        "sets": 4,
        "reps": 8,
        "weight": 185
      }
    ]
  }'
```

## 🧪 Testing

### Run backend tests:

```bash
cd backend
npm test
```

### Run frontend tests:

```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend:

```bash
cd backend
npm run build
npm start
```

### Frontend:

```bash
cd frontend
npm run build
```

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, etc.)

1. Ensure MongoDB URI is set in production environment
2. Build: `npm run build`
3. Start: `npm start`

### Frontend Deployment (Vercel, Netlify, etc.)

1. Set `REACT_APP_API_URL` to your production API
2. Build: `npm run build`
3. Deploy the `build` folder

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [@YourGitHub](https://github.com/yourgithub)

## 🙏 Acknowledgments

- Express.js documentation
- React documentation
- MongoDB/Mongoose guides
- Community contributions

---

**Built with ❤️ for fitness enthusiasts**
