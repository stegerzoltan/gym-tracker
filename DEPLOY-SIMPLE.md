# 🚀 Deployment Instructions

## Step 1: Deploy Backend to Render

1. Go to **https://render.com** and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your repository: **stegerzoltan/gym-tracker**
4. Configure:
   - **Name**: `gym-tracker-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   MONGODB_URI=mongodb+srv://stegerzoltan_db_user:LvKadjuQq1iUCLOT@gym-tracker.kmmdxdt.mongodb.net/gym-tracker?retryWrites=true&w=majority
   JWT_SECRET=gym_tracker_secret_key_2024
   NODE_ENV=production
   CORS_ORIGIN=*
   PORT=5000
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (2-3 minutes)
8. **COPY YOUR BACKEND URL** (e.g., `https://gym-tracker-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

The deployment will start automatically with the commands below. When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → gym-tracker (or press Enter)
- **Directory?** → ./ (press Enter)
- **Override settings?** → No

After deployment, you'll need to add the backend URL as environment variable.

---

## Step 3: Configure MongoDB Atlas

1. Go to **https://cloud.mongodb.com**
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

This allows Render to connect to your MongoDB database.

---

## 📝 After Deployment

1. Update CORS_ORIGIN in Render with your Vercel URL
2. Visit your Vercel URL
3. Register and test the app!
