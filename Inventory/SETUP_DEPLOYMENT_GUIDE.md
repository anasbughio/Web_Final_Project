# Complete Setup & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [MongoDB Setup](#mongodb-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Testing the System](#testing-the-system)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Local Development Setup

### System Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **MongoDB**: v4.4.0 or higher
- **Git**: v2.0.0 or higher (optional)
- **2GB RAM** minimum
- **500MB** free disk space

### Verify Installation
```bash
# Check Node.js
node --version
# Expected: v14.0.0 or higher

# Check npm
npm --version
# Expected: v6.0.0 or higher

# Check MongoDB (if installed locally)
mongod --version
# Expected: db version v4.4.0 or higher
```

---

## MongoDB Setup

### Option 1: Local MongoDB Installation

#### Windows
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Complete" installation
4. Choose "Install MongoDB as a Service"
5. Start MongoDB:
   ```bash
   net start MongoDB
   ```

#### macOS (Homebrew)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongo --version
```

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB key
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongod --version
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email

2. **Create Cluster**
   - Choose Cloud Provider (AWS, Azure, GCP)
   - Choose Region (same as deployment for best performance)
   - Click "Create Cluster"
   - Wait for cluster to deploy (5-10 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin` (or your preferred)
   - Password: Generate secure password
   - Click "Add User"

4. **Get Connection String**
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Example: `mongodb+srv://admin:password@cluster.mongodb.net/inventory_management`

5. **Whitelist IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Add 0.0.0.0/0 (allows all IPs)
   - For production: Add only your server's IP

---

## Environment Configuration

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env file**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   # For Local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/inventory_management
   
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/inventory_management

   # Security
   JWT_SECRET=your_super_secret_key_change_this_in_production
   ```

4. **Generate Secure JWT Secret** (for production)
   ```bash
   # Using OpenSSL
   openssl rand -hex 32

   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Using Python
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Create .env file** (optional, default is localhost:5000)
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

---

## Running the Application

### Terminal 1: Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Expected output:
# MongoDB Connected: localhost
# Server is running on port 5000
```

### Terminal 2: Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start

# Browser should open automatically
# If not, go to http://localhost:3000
```

### Verify Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   
   # Expected response:
   # {"message":"Server is running"}
   ```

2. **Frontend Access**
   - Open browser: http://localhost:3000
   - You should see login page

---

## Testing the System

### Create Test Accounts

#### Via Frontend (Recommended)
1. Open http://localhost:3000
2. Click "Register here"
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click Register

#### Via API (Terminal)
```bash
# Register Admin User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "Admin"
  }'

# Register Store Manager
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manager User",
    "email": "manager@example.com",
    "password": "manager123",
    "role": "Store Manager"
  }'

# Register Employee
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee User",
    "email": "employee@example.com",
    "password": "employee123",
    "role": "Employee"
  }'
```

### Test Admin Features

1. **Login as Admin**
   - Email: admin@example.com
   - Password: admin123

2. **Create Product**
   - Go to Products
   - Click "+ Add Product"
   - Fill details:
     - Name: Test Product
     - SKU: PROD001
     - Category: Electronics
     - Price: 99.99
     - Quantity: 50
   - Click "Create Product"

3. **Create User**
   - Go to Users
   - Click "+ Add User"
   - Fill details:
     - Name: New User
     - Email: newuser@example.com
     - Password: password123
     - Role: Employee
   - Click "Create User"

### Test Role-Based Access

1. **Admin User**
   - Access Products ✓
   - Access Users ✓
   - Create Product ✓
   - Delete Product ✓

2. **Store Manager**
   - Access Products ✓
   - Create Product ✓
   - Delete Product ✗
   - Access Users ✗

3. **Employee**
   - Access Products ✓
   - Create Product ✗
   - Access Users ✗

---

## Troubleshooting

### MongoDB Connection Issues

**Error: "Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
# macOS:
brew services start mongodb-community

# Windows:
net start MongoDB

# Linux:
sudo systemctl start mongod
```

**Error: "MongoServerError: connect ECONNREFUSED"**
- Verify MongoDB is running
- Check MongoDB URI in .env
- Confirm MongoDB port 27017 is accessible

### Port Already in Use

**Error: "EADDRINUSE :::5000"**
```bash
# Kill process on port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows (PowerShell):
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution**: Change port in backend .env
```env
PORT=5001
```

### CORS Errors

**Error: "Access to XMLHttpRequest blocked by CORS policy"**
- Ensure backend is running
- Verify API_URL in frontend .env
- Check backend CORS configuration

**Solution**: Update frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Frontend Blank Page

**Error: "Blank white page after npm start"**
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules
npm install

# Clear browser cache
# Hard refresh: Ctrl+Shift+Delete (Chrome/Firefox)
# Hard refresh: Cmd+Shift+Delete (Mac Safari)
```

### Dependencies Issues

**Error: "npm ERR! peer dep missing"**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

**Error: "Invalid email or password"**
- Verify user exists in database
- Confirm password is correct
- Check email format

**Error: "No token provided"**
- Login first
- Token should be in localStorage
- Clear localStorage and login again

**Error: "Invalid or expired token"**
- Token may be expired (7 days)
- Clear localStorage
- Login again

---

## Production Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows (PowerShell)
   choco install heroku-cli
   
   # Linux
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   # Opens browser, sign in
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   # Use MongoDB Atlas URI for production
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory
   heroku config:set JWT_SECRET=your_production_secret_key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/inventory-frontend
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api`

4. **Deploy**
   - Vercel will automatically deploy on push
   - View at https://your-project.vercel.app

### Database for Production

**Use MongoDB Atlas** (recommended):
- Better security
- Automatic backups
- Scalability
- No server management

**Connection Steps**:
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to Heroku config:
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
   ```

---

## Performance Optimization

### Backend
- Use MongoDB indexes
- Implement caching
- Use connection pooling
- Optimize query performance

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle optimization

---

## Security Checklist

- [x] Change JWT_SECRET in production
- [x] Use HTTPS for all connections
- [x] Enable MongoDB authentication
- [x] Whitelist IP addresses
- [x] Set strong passwords
- [x] Enable CORS only for your domain
- [x] Use environment variables
- [x] Keep dependencies updated

---

## Monitoring & Maintenance

### Backend Monitoring
```bash
# Check logs
heroku logs --tail

# Monitor errors
# Use New Relic or DataDog for production
```

### Database Monitoring
```bash
# MongoDB Atlas dashboard
# View metrics, performance, backup status
```

### Frontend Monitoring
```bash
# Vercel dashboard
# View deployment history, analytics
```

---

## Backup & Recovery

### Database Backup
1. **MongoDB Atlas** (automatic):
   - Enabled by default
   - Hourly snapshots
   - Up to 35 days retention

2. **Manual Backup**:
   ```bash
   mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/database" --out ./backup
   ```

### Restore from Backup
```bash
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/database" ./backup
```

---

## Support & Contact

- **Documentation**: See README.md
- **Quick Start**: See QUICKSTART.md
- **Issues**: Check troubleshooting section
- **Features**: Review PROJECT_SUMMARY.md

---

**Version**: 1.0.0
**Last Updated**: January 24, 2026
**Status**: Production Ready ✅
