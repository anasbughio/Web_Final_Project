# Inventory & Stock Management System - Frontend

A modern React frontend for managing products and stock levels with role-based access control.

## Features

- **User Authentication**
  - Registration and login
  - JWT token management
  - Protected routes
  - Persistent sessions

- **Dashboard**
  - Welcome message with user info
  - Statistics (total products, low stock items)
  - Role-based permission display
  - Quick overview of inventory status

- **Product Management**
  - View all products with filters
  - Create new products
  - Edit existing products
  - Delete products (Admin only)
  - Low-stock alerts with visual indicators
  - Search and filter capabilities

- **User Management** (Admin Only)
  - View all users
  - Create new users
  - Edit user roles and details
  - Deactivate users
  - Role-based badges

- **Role-Based Access Control**
  - Admin: Full access
  - Store Manager: Product management only
  - Employee: View-only access

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API URL** (Optional)
Create a `.env` file if you need to change the API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Navigation bar
│   │   └── PrivateRoute.js     # Protected routes
│   ├── context/
│   │   └── AuthContext.js      # Auth context & hooks
│   ├── pages/
│   │   ├── Login.js            # Login page
│   │   ├── Register.js         # Register page
│   │   ├── Dashboard.js        # Dashboard page
│   │   ├── Products.js         # Products management
│   │   └── Users.js            # User management
│   ├── services/
│   │   └── api.js              # API client & endpoints
│   ├── styles/
│   │   ├── navbar.css          # Navbar styles
│   │   ├── auth.css            # Auth pages styles
│   │   ├── dashboard.css       # Dashboard styles
│   │   ├── products.css        # Products page styles
│   │   └── users.css           # Users page styles
│   ├── App.js                  # Main App component
│   ├── App.css                 # Global styles
│   └── index.js                # Entry point
├── package.json                # Dependencies
└── .gitignore                  # Git ignore rules
```

## Components

### Navbar
Displays user information and logout button when authenticated.

### PrivateRoute
Protected route component that requires authentication. Can also require specific roles.

```javascript
<PrivateRoute allowedRoles={['Admin']}>
  <Users />
</PrivateRoute>
```

## Pages

### Login
User login with email and password.

### Register
New user registration with role assignment (defaults to Employee).

### Dashboard
Shows:
- Welcome message with user name
- User role badge
- Statistics cards (total products, low stock items)
- Permission list based on user role

### Products
- Display all products in a table
- Filter by category and price
- Create, edit, and delete products
- Visual low-stock alerts
- Only available to Admin and Store Manager

### Users (Admin Only)
- Manage all users in the system
- Create new users with specific roles
- Edit user details and roles
- Deactivate/delete users

## Authentication Context

The `AuthContext` provides:
- `user` - Current logged-in user object
- `token` - JWT authentication token
- `loading` - Loading state
- `login()` - Login user
- `logout()` - Logout user

Usage:
```javascript
import { useAuth } from '../context/AuthContext';

const { user, token, logout } = useAuth();
```

## API Service

The `api.js` provides axios instance with interceptors for authentication:

```javascript
// Auth APIs
authAPI.register(name, email, password)
authAPI.login(email, password)

// Product APIs
productAPI.getAll(params)
productAPI.getById(id)
productAPI.create(data)
productAPI.update(id, data)
productAPI.delete(id)
productAPI.getLowStock()

// User APIs (Admin only)
userAPI.getAll()
userAPI.getById(id)
userAPI.create(data)
userAPI.update(id, data)
userAPI.delete(id)
```

## Styling

The application uses CSS for styling with a modern gradient theme:
- Primary Color: `#667eea` to `#764ba2` (gradient)
- Secondary Colors: Green (`#56ab2f`), Orange (`#ff9800`), Red (`#f44336`)
- Responsive design for mobile and desktop

## Features by Role

### Admin
- ✓ View all products
- ✓ Create, edit, and delete products
- ✓ View all users
- ✓ Create, edit, and delete users
- ✓ Access dashboard and reports
- ✓ See low-stock alerts

### Store Manager
- ✓ View all products
- ✓ Create, edit, and update products
- ✗ Cannot delete products
- ✗ Cannot manage users
- ✓ See low-stock alerts

### Employee
- ✓ View product details
- ✗ Cannot create products
- ✗ Cannot edit or delete products
- ✗ Cannot manage users

## Form Validation

- Required field validation
- Email format validation
- Password strength requirements
- Product SKU uniqueness check
- Email uniqueness check for users

## Error Handling

- Display error messages on API failures
- Validation error messages
- Unauthorized/forbidden error handling
- Network error handling

## Local Storage

- JWT token stored in localStorage
- User information stored in localStorage
- Automatic session recovery on page reload

## Responsive Design

The application is responsive and works on:
- Desktop (1024px and above)
- Tablet (768px to 1024px)
- Mobile (below 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environmental Variables

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running with Backend

Make sure both backend and frontend are running:
1. Backend: `npm run dev` in `/backend`
2. Frontend: `npm start` in `/frontend`

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` environment variable
- Verify CORS is enabled in backend

### Login Issues
- Verify credentials
- Check if backend MongoDB is connected
- Clear localStorage and try again

### Styling Issues
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check CSS file paths

## License

ISC

## Support

For issues and support, please contact the development team.
