# 🚀 Nilu' Crochet - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### 📋 Prerequisites
- Node.js (v18+)
- PNPM or NPM
- MongoDB Atlas account (free tier works)

### 🔧 Quick Setup

#### 1. Install Dependencies
```bash
pnpm install
```

#### 2. Configure Environment
Create `server/.env`:
```env
MONGODB_URI=mongodb+srv://nilu-crochet:SlypCF33nVa49PH9@cluster0.wqki96j.mongodb.net/nilu-crochet
PORT=3002
JWT_SECRET=nilu-crochet-secret-key-2024
MAILERSEND_API_KEY=mlsn.054c2524c06a706f96e97576b36a914c1f3ac6ed40854c34ccf07f7efe1eebe2
GOOGLE_CLIENT_ID=420072577736-pqp318sj1r7rhk5dbb0o03tn9f3bhimj.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5175
BACKEND_URL=http://localhost:3002
```

#### 3. Start Development Server
```bash
pnpm run dev
```

#### 4. Access Application
- **Frontend**: http://localhost:5175
- **Admin Login**: username=`admin`, password=`admin123`

---

## 🏗️ Architecture Overview

### Two-Server Architecture:
```
Frontend (React + Vite)     Backend (Express.js)
Port: 5175              →   Port: 3002
                           ↓
                        MongoDB Atlas
```

### Why Two Servers?
- **NOT Next.js**: This uses React + Vite (frontend) + Express.js (backend)
- **Separation**: Frontend and backend can be deployed independently
- **Scalability**: Each server can be scaled separately
- **Development**: Teams can work on frontend/backend independently

---

## 🔄 Development Workflow

### Start Both Servers:
```bash
pnpm run dev
```
This command uses `concurrently` to run:
- `pnpm run dev:server` (Backend on port 3002)
- `pnpm run dev:client` (Frontend on port 5175)

### Start Servers Separately:
```bash
# Terminal 1 - Backend
pnpm run dev:server

# Terminal 2 - Frontend
pnpm run dev:client
```

---

## 🔐 Authentication Testing

### Default Admin Account:
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full admin dashboard

### Test User Registration:
1. Go to http://localhost:5175/register
2. Create new customer account
3. Data saves to MongoDB Atlas

### API Testing:
```bash
# Test login API
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test health check
curl http://localhost:3002/api/health
```

---

## 📁 Key Files

### Frontend:
- `src/pages/Index.tsx` - Homepage
- `src/contexts/AuthContext.tsx` - Authentication
- `src/lib/api.ts` - API client
- `vite.config.ts` - Proxy configuration

### Backend:
- `server/index.js` - Main server file
- `server/.env` - Environment variables
- `server/models/` - Database models

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot find package 'express'"
```bash
pnpm install
```

### Issue: "Port already in use"
```bash
pkill -f "node.*server"
pnpm run dev
```

### Issue: "Unexpected token '<'"
- **Cause**: Backend server not running
- **Solution**: Start backend with `pnpm run dev:server`

### Issue: Authentication not working
- **Check**: Backend server running on port 3002
- **Test**: `curl http://localhost:3002/api/health`
- **Verify**: Admin user created (check server logs)

---

## 📊 Project Status

### ✅ Working Features:
- User authentication (login/register)
- MongoDB Atlas integration
- Admin dashboard access
- Product management (via admin)
- Email notifications
- File upload system
- Google OAuth integration

### 🎯 Ready for:
- Adding products via admin panel
- Processing customer orders
- Managing inventory
- Sending order confirmations

---

## 🚀 Next Steps

1. **Add Products**: Login as admin → Add your crochet products
2. **Test Orders**: Create test orders as customer
3. **Customize**: Update branding, colors, product categories
4. **Deploy**: Build for production when ready

---

**Need help? Check the full `PROJECT_DOCUMENTATION.md` for detailed information.**