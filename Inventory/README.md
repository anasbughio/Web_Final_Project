# Inventory & Stock Management System

A full-stack MERN application for managing products and stock levels with role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)

## ✨ Features

### 1. Product Management (CRUD Operations)
- ✓ **Create Product**: Add new products with details, pricing, and stock info
- ✓ **Read Products**: View all products or specific product details
- ✓ **Update Product**: Modify product information and stock levels
- ✓ **Delete Product**: Remove products from inventory
- ✓ **Low-Stock Alerts**: Automatic alerts when stock falls below minimum level

### 2. User Management (Admin Only)
- ✓ **Create Users**: Add new users with assigned roles
- ✓ **Read Users**: View all users and user details
- ✓ **Update Users**: Modify user information and roles
- ✓ **Delete Users**: Remove users from system

### 3. Role-Based Access Control
- **Admin**: Full access to all operations (products + users)
- **Store Manager**: Can create, read, and update products only
- **Employee**: Can only view product details

### 4. Authentication & Authorization
- ✓ JWT-based authentication
- ✓ Secure password hashing (bcryptjs)
- ✓ Protected routes with role validation
- ✓ Token-based session management

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **UI Library**: React.js
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern gradients
- **State Management**: React Context API

## 📁 Project Structure

```
Inventory/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── productController.js  # Product CRUD
│   │   └── userController.js     # User CRUD
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── role.js               # Role authorization
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Product.js            # Product schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── server.js                 # Main server
│   ├── package.json              # Dependencies
│   ├── .env.example              # Env template
│   └── README.md                 # Backend docs
│
└── frontend/
    ├── public/
    │   └── index.html            # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js         # Navigation
    │   │   └── PrivateRoute.js   # Route protection
    │   ├── context/
    │   │   └── AuthContext.js    # Auth context
    │   ├── pages/
    │   │   ├── Login.js          # Login page
    │   │   ├── Register.js       # Register page
    │   │   ├── Dashboard.js      # Dashboard
    │   │   ├── Products.js       # Products management
    │   │   └── Users.js          # User management
    │   ├── services/
    │   │   └── api.js            # API client
    │   ├── styles/
    │   │   ├── navbar.css
    │   │   ├── auth.css
    │   │   ├── dashboard.css
    │   │   ├── products.css
    │   │   └── users.css
    │   ├── App.js                # Main component
    │   ├── index.js              # Entry point
    │   └── package.json          # Dependencies
    └── README.md                 # Frontend docs
```

## 🚀 Installation

### Prerequisites
- **Node.js** v14 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure .env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

5. **Start MongoDB** (if running locally)
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB from Services or run mongod.exe
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (Optional)
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## ⚙️ Configuration

### MongoDB Connection
Update `MONGODB_URI` in backend `.env`:

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/inventory_management
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inventory_management
```

### JWT Secret
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `JWT_SECRET` in backend `.env` with the generated value.

## 🏃 Running the Application

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Employee"
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Endpoints

**Get All Products**
```
GET /api/products
Authorization: Bearer <token>
```

**Get Product by ID**
```
GET /api/products/:id
Authorization: Bearer <token>
```

**Get Low Stock Products**
```
GET /api/products/low-stock
Authorization: Bearer <token>
```

**Create Product** (Admin, Store Manager)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU001",
  "category": "Category",
  "price": 99.99,
  "quantity": 100,
  "minStockLevel": 10,
  "description": "Description"
}
```

**Update Product** (Admin, Store Manager)
```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99,
  "quantity": 95
}
```

**Delete Product** (Admin Only)
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

### User Endpoints (Admin Only)

**Get All Users**
```
GET /api/users
Authorization: Bearer <token>
```

**Get User by ID**
```
GET /api/users/:id
Authorization: Bearer <token>
```

**Create User**
```
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "Store Manager"
}
```

**Update User**
```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Updated",
  "role": "Admin",
  "isActive": true
}
```

**Delete User**
```
DELETE /api/users/:id
Authorization: Bearer <token>
```

## 👥 User Roles & Permissions

### Admin
- Create, read, update, delete products
- Create, read, update, delete users
- View all reports and statistics
- Full system access

### Store Manager
- Create, read, update products
- Cannot delete products
- Cannot manage users
- Cannot access user management

### Employee
- Read/view products only
- Cannot create, edit, or delete products
- Cannot manage users
- Limited to inventory viewing

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (Admin|Store Manager|Employee, default: Employee),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  sku: String (required, unique),
  category: String (required),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  minStockLevel: Number (default: 10),
  maxStockLevel: Number,
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  lastUpdatedBy: ObjectId (ref: User),
  isLowStock: Boolean (virtual, calculated),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **JWT Authentication**: Token-based secure sessions
- **Role-Based Access**: Endpoint-level authorization
- **Input Validation**: Express validator for all inputs
- **CORS Protection**: Configured for safe cross-origin requests
- **Error Handling**: Comprehensive error handling middleware

## 🧪 Testing the System

### Test Accounts

**Admin Account**
```
Email: admin@example.com
Password: admin123
Role: Admin
```

**Store Manager Account**
```
Email: manager@example.com
Password: manager123
Role: Store Manager
```

**Employee Account**
```
Email: employee@example.com
Password: employee123
Role: Employee
```

Create these accounts through the registration page or API.

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Backend Connection Issues
- Verify MongoDB is running
- Check MongoDB URI in .env
- Ensure port 5000 is available

### Frontend API Errors
- Verify backend is running
- Check API URL in .env
- Clear browser localStorage
- Check browser console for errors

### CORS Issues
- Ensure CORS is enabled in backend
- Verify frontend URL matches backend configuration

## 📦 Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- express-validator: Input validation

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- react-dom: DOM rendering

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku account and install CLI
2. `heroku login`
3. `heroku create your-app-name`
4. Set environment variables: `heroku config:set JWT_SECRET=your_secret`
5. `git push heroku main`

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set REACT_APP_API_URL environment variable
4. Deploy

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please follow the project structure and coding standards.

## 📞 Support

For issues, questions, or suggestions, please reach out to the development team.

---

**Last Updated**: January 24, 2026
**Version**: 1.0.0
