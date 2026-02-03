# Gym Tracker - Deployment Guide

## 🚀 Quick Deploy

### Backend (Render)

1. **Go to [Render.com](https://render.com)** and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `stegerzoltan/gym-tracker`
4. Configure:
   - **Name**: `gym-tracker-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**:

   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://stegerzoltan_db_user:LvKadjuQq1iUCLOT@gym-tracker.kmmdxdt.mongodb.net/gym-tracker?retryWrites=true&w=majority
   JWT_SECRET=gym_tracker_secret_key_2024
   NODE_ENV=production
   CORS_ORIGIN=*
   ```

6. Click **"Create Web Service"**
7. **Copy your backend URL** (e.g., `https://gym-tracker-api.onrender.com`)

### Frontend (Vercel)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Go to frontend directory**:

   ```bash
   cd /home/stege/reference1/frontend
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Follow prompts**:
   - Link to existing project? **N**
   - Project name: **gym-tracker**
   - Directory: **./ (current)**
   - Override settings? **N**

5. **Set environment variable**:

   ```bash
   vercel env add REACT_APP_API_URL
   ```

   Enter your Render backend URL: `https://gym-tracker-api.onrender.com/api`

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

---

## Alternative: Deploy Both to Render

### Backend (Same as above)

### Frontend (Render Static Site)

1. Go to Render → **"New +"** → **"Static Site"**
2. Connect repository: `stegerzoltan/gym-tracker`
3. Configure:
   - **Name**: `gym-tracker-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://gym-tracker-api.onrender.com/api
   ```

---

## 📝 Important Notes

- **First deploy on Render free tier may take 1-2 minutes to start**
- **Backend URL must be added to frontend environment**
- **MongoDB Atlas must allow connections from anywhere (0.0.0.0/0) for Render**
- **Update CORS_ORIGIN on backend after frontend is deployed**

---

## 🔗 After Deployment

1. Visit your frontend URL
2. Register a new account
3. Load default exercises
4. Start tracking workouts!
