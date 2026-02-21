# API Reference Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except /auth/*) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint**: `POST /auth/register`
**Auth Required**: No
**Access Level**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Employee"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | User's email (must be unique) |
| password | string | Yes | User's password |
| role | string | No | User role (Admin, Store Manager, Employee). Defaults to Employee |

**Success Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "605e90e30c87c42508a8d2e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Employee"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "User already exists"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 2. Login User
Authenticate user and get JWT token.

**Endpoint**: `POST /auth/login`
**Auth Required**: No
**Access Level**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email |
| password | string | Yes | User's password |

**Success Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "605e90e30c87c42508a8d2e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Employee"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Invalid email or password"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Product Endpoints

### 1. Get All Products
Retrieve all active products with optional filters.

**Endpoint**: `GET /products`
**Auth Required**: Yes
**Access Level**: All authenticated users

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| lowStockOnly | boolean | Show only low-stock items |

**Success Response** (200 OK):
```json
{
  "message": "Products retrieved successfully",
  "count": 5,
  "products": [
    {
      "_id": "605e90e30c87c42508a8d2e1",
      "name": "Laptop",
      "sku": "LAP001",
      "category": "Electronics",
      "price": 999.99,
      "quantity": 10,
      "minStockLevel": 5,
      "maxStockLevel": 100,
      "description": "High-performance laptop",
      "isActive": true,
      "isLowStock": false,
      "createdBy": {
        "_id": "user_id",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "createdAt": "2023-03-28T10:00:00Z",
      "updatedAt": "2023-03-28T10:00:00Z"
    }
  ]
}
```

**cURL Example**:
```bash
# Get all products
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>"

# Filter by category
curl -X GET "http://localhost:5000/api/products?category=Electronics" \
  -H "Authorization: Bearer <token>"

# Filter by price range
curl -X GET "http://localhost:5000/api/products?minPrice=100&maxPrice=1000" \
  -H "Authorization: Bearer <token>"
```

---

### 2. Get Specific Product
Retrieve details of a single product.

**Endpoint**: `GET /products/:id`
**Auth Required**: Yes
**Access Level**: All authenticated users

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID (MongoDB ObjectId) |

**Success Response** (200 OK):
```json
{
  "message": "Product retrieved successfully",
  "product": {
    "_id": "605e90e30c87c42508a8d2e1",
    "name": "Laptop",
    "sku": "LAP001",
    "category": "Electronics",
    "price": 999.99,
    "quantity": 10,
    "minStockLevel": 5,
    "description": "High-performance laptop",
    "isActive": true,
    "isLowStock": false
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Product not found"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/products/605e90e30c87c42508a8d2e1 \
  -H "Authorization: Bearer <token>"
```

---

### 3. Get Low Stock Products
Retrieve all products with stock below minimum level.

**Endpoint**: `GET /products/low-stock`
**Auth Required**: Yes
**Access Level**: All authenticated users

**Success Response** (200 OK):
```json
{
  "message": "Low stock products retrieved successfully",
  "count": 2,
  "products": [
    {
      "_id": "605e90e30c87c42508a8d2e1",
      "name": "Mouse",
      "sku": "MOU001",
      "quantity": 3,
      "minStockLevel": 10,
      "isLowStock": true
    }
  ]
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/products/low-stock \
  -H "Authorization: Bearer <token>"
```

---

### 4. Create Product
Create a new product. Requires Admin or Store Manager role.

**Endpoint**: `POST /products`
**Auth Required**: Yes
**Access Level**: Admin, Store Manager

**Request Body**:
```json
{
  "name": "Laptop",
  "sku": "LAP001",
  "category": "Electronics",
  "price": 999.99,
  "quantity": 50,
  "minStockLevel": 10,
  "maxStockLevel": 200,
  "description": "High-performance laptop"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name |
| sku | string | Yes | Unique stock keeping unit |
| category | string | Yes | Product category |
| price | number | Yes | Product price (min: 0) |
| quantity | number | Yes | Current stock quantity |
| minStockLevel | number | No | Minimum stock alert level (default: 10) |
| maxStockLevel | number | No | Maximum stock level |
| description | string | No | Product description |

**Success Response** (201 Created):
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "605e90e30c87c42508a8d2e1",
    "name": "Laptop",
    "sku": "LAP001",
    "category": "Electronics",
    "price": 999.99,
    "quantity": 50,
    "minStockLevel": 10,
    "createdBy": "user_id",
    "createdAt": "2023-03-28T10:00:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Product with this SKU already exists"
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "Access denied. Required role: Admin or Store Manager"
}
```

**cURL Example**:
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

---

### 5. Update Product
Update an existing product. Requires Admin or Store Manager role.

**Endpoint**: `PUT /products/:id`
**Auth Required**: Yes
**Access Level**: Admin, Store Manager

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID |

**Request Body** (all fields optional):
```json
{
  "name": "Updated Laptop",
  "price": 899.99,
  "quantity": 45,
  "minStockLevel": 8
}
```

**Success Response** (200 OK):
```json
{
  "message": "Product updated successfully",
  "product": {
    "_id": "605e90e30c87c42508a8d2e1",
    "name": "Updated Laptop",
    "price": 899.99,
    "quantity": 45,
    "minStockLevel": 8,
    "lastUpdatedBy": "user_id"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Product not found"
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/products/605e90e30c87c42508a8d2e1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99,
    "quantity": 45
  }'
```

---

### 6. Delete Product
Delete (soft delete) a product. Requires Admin role only.

**Endpoint**: `DELETE /products/:id`
**Auth Required**: Yes
**Access Level**: Admin only

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID |

**Success Response** (200 OK):
```json
{
  "message": "Product deleted successfully",
  "product": {
    "_id": "605e90e30c87c42508a8d2e1",
    "name": "Laptop",
    "isActive": false
  }
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "Access denied. Required role: Admin"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/products/605e90e30c87c42508a8d2e1 \
  -H "Authorization: Bearer <token>"
```

---

## User Endpoints (Admin Only)

### 1. Get All Users
Retrieve all users. Requires Admin role.

**Endpoint**: `GET /users`
**Auth Required**: Yes
**Access Level**: Admin only

**Success Response** (200 OK):
```json
{
  "message": "Users retrieved successfully",
  "count": 3,
  "users": [
    {
      "_id": "605e90e30c87c42508a8d2e1",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "isActive": true,
      "createdAt": "2023-03-28T10:00:00Z"
    }
  ]
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "Access denied. Required role: Admin"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <token>"
```

---

### 2. Get Specific User
Retrieve details of a single user. Requires Admin role.

**Endpoint**: `GET /users/:id`
**Auth Required**: Yes
**Access Level**: Admin only

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | User ID |

**Success Response** (200 OK):
```json
{
  "message": "User retrieved successfully",
  "user": {
    "_id": "605e90e30c87c42508a8d2e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Employee",
    "isActive": true
  }
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/users/605e90e30c87c42508a8d2e1 \
  -H "Authorization: Bearer <token>"
```

---

### 3. Create User
Create a new user. Requires Admin role.

**Endpoint**: `POST /users`
**Auth Required**: Yes
**Access Level**: Admin only

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "Store Manager"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | User's email (must be unique) |
| password | string | Yes | User's password |
| role | string | Yes | User role (Admin, Store Manager, Employee) |

**Success Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "605e90e30c87c42508a8d2e1",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "Store Manager"
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "Store Manager"
  }'
```

---

### 4. Update User
Update user information. Requires Admin role.

**Endpoint**: `PUT /users/:id`
**Auth Required**: Yes
**Access Level**: Admin only

**Request Body** (all fields optional):
```json
{
  "name": "Jane Updated",
  "role": "Admin",
  "isActive": true
}
```

**Success Response** (200 OK):
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "605e90e30c87c42508a8d2e1",
    "name": "Jane Updated",
    "email": "jane@example.com",
    "role": "Admin",
    "isActive": true
  }
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/users/605e90e30c87c42508a8d2e1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Admin"
  }'
```

---

### 5. Delete User
Delete (soft delete) a user. Requires Admin role.

**Endpoint**: `DELETE /users/:id`
**Auth Required**: Yes
**Access Level**: Admin only

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | User ID |

**Success Response** (200 OK):
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": "605e90e30c87c42508a8d2e1",
    "name": "Jane Smith",
    "isActive": false
  }
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/users/605e90e30c87c42508a8d2e1 \
  -H "Authorization: Bearer <token>"
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Common Error Responses

### Unauthorized (No Token)
```json
{
  "message": "No token provided"
}
```

### Invalid Token
```json
{
  "message": "Invalid or expired token"
}
```

### Forbidden (Insufficient Permissions)
```json
{
  "message": "Access denied. Required role: Admin"
}
```

### Validation Error
```json
{
  "message": "Error creating product",
  "error": "Validation error details"
}
```

---

## Response Format

All API responses follow this format:

**Success Response**:
```json
{
  "message": "Success message",
  "data": { ... },  // Optional
  "count": 5        // Optional, for lists
}
```

**Error Response**:
```json
{
  "message": "Error message",
  "error": "Error details"  // Optional
}
```

---

## Rate Limiting
Currently no rate limiting. Implement for production.

## API Versioning
Current version: v1 (implicit in /api/ prefix)

---

**API Version**: 1.0
**Last Updated**: January 24, 2026
