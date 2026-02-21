const Product = require('../models/Product');
const Order = require('../models/Order');

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, sku, category, price, quantity, minStockLevel, maxStockLevel } =
      req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const newProduct = new Product({
      name,
      description,
      sku,
      category,
      price,
      quantity,
      minStockLevel,
      maxStockLevel,
      createdBy: req.user.id,
      lastUpdatedBy: req.user.id,
    });

    await newProduct.save();
    await newProduct.populate('createdBy lastUpdatedBy', 'name email');

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Read All Products
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, lowStockOnly } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let products = await Product.find(query).populate('createdBy lastUpdatedBy', 'name email');

    // Filter low stock items if requested
    if (lowStockOnly === 'true') {
      products = products.filter((product) => product.isLowStock);
    }

    res.status(200).json({
      message: 'Products retrieved successfully',
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
};

// Read Specific Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'createdBy lastUpdatedBy',
      'name email'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { name, description, sku, category, price, quantity, minStockLevel, maxStockLevel } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if SKU is being changed and if new SKU already exists
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
      product.sku = sku;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (minStockLevel !== undefined) product.minStockLevel = minStockLevel;
    if (maxStockLevel !== undefined) product.maxStockLevel = maxStockLevel;

    product.lastUpdatedBy = req.user.id;

    await product.save();
    await product.populate('createdBy lastUpdatedBy', 'name email');

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get Low Stock Products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate(
      'createdBy lastUpdatedBy',
      'name email'
    );

    const lowStockProducts = products.filter((product) => product.isLowStock);

    res.status(200).json({
      message: 'Low stock products retrieved successfully',
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving low stock products', error: error.message });
  }
};

// Buy/Purchase Product - Decrease Inventory
const buyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is inactive' });
    }

    // Check if sufficient quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({
        message: 'Insufficient inventory',
        available: product.quantity,
        requested: quantity,
        shortfall: quantity - product.quantity,
      });
    }

    // Decrease quantity
    product.quantity -= quantity;
    product.lastUpdatedBy = req.user.id;

    await product.save();
    await product.populate('createdBy lastUpdatedBy', 'name email');

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order record
    const order = new Order({
      productId: product._id,
      productName: product.name,
      productSku: product.sku,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      buyerId: req.user.id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      orderNumber,
      status: 'Completed',
    });

    await order.save();

    res.status(200).json({
      message: 'Product purchased successfully',
      order: {
        orderNumber: order.orderNumber,
        id: order._id,
        productName: product.name,
        quantity: quantity,
        remainingStock: product.quantity,
        price: product.price,
        totalPrice: product.price * quantity,
      },
      transaction: {
        timestamp: order.createdAt,
        buyerId: req.user.id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing product', error: error.message });
  }
};

// Get Order History - All orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('productId', 'name sku category price')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

// Get User's Order History
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate('productId', 'name sku category price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'User orders retrieved successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user orders', error: error.message });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('productId')
      .populate('buyerId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order', error: error.message });
  }
};

module.exports = {
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
};
