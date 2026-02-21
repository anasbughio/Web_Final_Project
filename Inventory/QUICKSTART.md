# Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js installed
- MongoDB running locally or MongoDB Atlas account
- Git (optional)

## Step 1: Backend Setup (2 minutes)

```bash
cd backend
npm install
```

### Configure Backend
1. Copy `.env.example` to `.env`
2. Update MongoDB URI:
   - Local: `mongodb://localhost:27017/inventory_management`
   - Cloud: `mongodb+srv://username:password@cluster.mongodb.net/inventory_management`
3. Set JWT_SECRET to any random string or:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Start Backend
```bash
npm run dev
```
✅ Backend runs on http://localhost:5000

## Step 2: Frontend Setup (2 minutes)

Open new terminal:
```bash
cd frontend
npm install
npm start
```
✅ Frontend opens at http://localhost:3000

## Step 3: Create Test Account

### Via Frontend (Recommended)
1. Click "Register here" on login page
2. Create account with any email/password
3. Login

### Via API (Alternative)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "Employee"
  }'
```

## Step 4: Explore Features

### As Employee
- View Products (Read-only)
- View Dashboard

### Create Admin Account (Postman/API)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "Admin"
  }'
```

Then login and access:
- Products Management (Create, Edit, Delete)
- User Management
- Full Admin Dashboard

## Common Issues

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MongoDB URI in .env
- Try MongoDB Atlas cloud version

### "Port 5000 already in use"
- Change PORT in backend .env
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### "Frontend shows blank page"
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

### "CORS error"
- Verify backend is running
- Check API_URL in frontend .env

## API Testing

Use any of these tools:
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download
- **curl**: Command line (see examples above)
- **Thunder Client**: VS Code extension

### Quick API Test
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login` → Copy token
3. Products: `GET /api/products` (with token in header)

## Project Structure Summary

```
Inventory/
├── backend/     ← Node.js + Express + MongoDB
├── frontend/    ← React + Axios
└── README.md    ← Full documentation
```

## Next Steps

1. **Customize**: Modify styles in `frontend/src/styles/`
2. **Extend Features**: Add new routes/models in backend
3. **Deploy**: Follow deployment section in main README

## Features Checklist

- [x] User Authentication (Register/Login)
- [x] Product CRUD Operations
- [x] User Management (Admin only)
- [x] Role-Based Access Control
- [x] Low-Stock Alerts
- [x] JWT Authorization
- [x] Password Hashing
- [x] Responsive UI
- [x] Error Handling

## Support Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Kill process on port
lsof -ti:5000 | xargs kill -9

# View MongoDB databases (if local)
mongo
> show dbs
> use inventory_management
> db.users.find()
```

---

For detailed documentation, see [README.md](./README.md)
