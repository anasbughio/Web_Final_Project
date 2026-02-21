const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  buyProduct,
  getAllOrders,
  getUserOrders,
  getOrderById,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// All product routes require authentication
router.use(authMiddleware);

// Create product - Admin and Store Manager only
router.post('/', roleMiddleware(['Admin', 'Store Manager']), createProduct);

// Get all products - All authenticated users
router.get('/', getAllProducts);

// Get low stock products - All authenticated users
router.get('/low-stock', getLowStockProducts);

// Order routes
router.get('/orders/all', roleMiddleware(['Admin']), getAllOrders);
router.get('/orders/my-orders', getUserOrders);
router.get('/orders/:id', getOrderById);

// Get product by ID - All authenticated users
router.get('/:id', getProductById);

// Buy/Purchase product - All authenticated users can buy
router.post('/:id/buy', buyProduct);

// Update product - Admin and Store Manager only
router.put('/:id', roleMiddleware(['Admin', 'Store Manager']), updateProduct);

// Delete product - Admin only
router.delete('/:id', roleMiddleware(['Admin']), deleteProduct);

module.exports = router;
