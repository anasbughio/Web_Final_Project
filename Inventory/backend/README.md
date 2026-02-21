# Inventory & Stock Management System - Backend

A robust Node.js/Express backend for managing products and stock levels with role-based access control.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Store Manager, Employee)
  - User registration and login
  - Secure password hashing with bcryptjs

- **Product Management**
  - Create, Read, Update, Delete (CRUD) operations
  - Low-stock alerts and tracking
  - Filter products by category and price
  - Track product stock levels and minimum thresholds

- **User Management** (Admin Only)
  - Create and manage users
  - Assign roles to users
  - Update user information
  - Deactivate/delete users

- **Role-Based Access Control**
  - Admin: Full access to all operations
  - Store Manager: Can manage products only
  - Employee: Can only view product details

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone or extract the project**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create .env file
cp .env.example .env

# Edit .env and add your configuration
# Update MONGODB_URI with your MongoDB connection string
# Update JWT_SECRET with a secure secret key
```

4. **Start the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `GET /api/products/low-stock` - Get low-stock products
- `POST /api/products` - Create product (Admin, Store Manager)
- `PUT /api/products/:id` - Update product (Admin, Store Manager)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── productController.js # Product CRUD
│   └── userController.js  # User CRUD
├── middleware/
│   ├── auth.js            # JWT verification
│   └── role.js            # Role-based access
├── models/
│   ├── User.js            # User schema
│   └── Product.js         # Product schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── productRoutes.js   # Product endpoints
│   └── userRoutes.js      # User endpoints
├── server.js              # Main server file
├── package.json           # Dependencies
└── .env.example           # Environment template
```

## Model Schemas

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (Admin, Store Manager, Employee),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Product Schema
```javascript
{
  name: String (required),
  description: String,
  sku: String (required, unique),
  category: String (required),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  minStockLevel: Number (default: 10),
  maxStockLevel: Number,
  isActive: Boolean (default: true),
  createdBy: ObjectId (User reference),
  lastUpdatedBy: ObjectId (User reference),
  timestamps: true,
  virtual: isLowStock (quantity <= minStockLevel)
}
```

## Authentication

### Register Request
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Employee"
}
```

### Login Request
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Employee"
  }
}
```

## Using the API

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Example Requests

### Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP001",
    "category": "Electronics",
    "price": 999.99,
    "quantity": 50,
    "minStockLevel": 10
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>"
```

### Get Low Stock Products
```bash
curl http://localhost:5000/api/products/low-stock \
  -H "Authorization: Bearer <token>"
```

## Role-Based Access

| Operation | Admin | Store Manager | Employee |
|-----------|-------|---------------|----------|
| Create Product | ✓ | ✓ | ✗ |
| Read Products | ✓ | ✓ | ✓ |
| Update Product | ✓ | ✓ | ✗ |
| Delete Product | ✓ | ✗ | ✗ |
| Create User | ✓ | ✗ | ✗ |
| Read Users | ✓ | ✗ | ✗ |
| Update User | ✓ | ✗ | ✗ |
| Delete User | ✓ | ✗ | ✗ |

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

## Security Features

- Passwords hashed with bcryptjs
- JWT-based authentication
- Role-based authorization
- Input validation
- CORS enabled
- Error handling middleware

## Testing

Use Postman or any API testing tool with the provided endpoints.

## License

ISC

## Support

For issues and support, please contact the development team.
