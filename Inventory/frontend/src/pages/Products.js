import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/products.css';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [buyModal, setBuyModal] = useState({ show: false, productId: null, quantity: 1 });
  const [buyMessage, setBuyMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    minStockLevel: 10,
    maxStockLevel: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.products);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await productAPI.create(formData);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const openBuyModal = (productId) => {
    setBuyModal({ show: true, productId, quantity: 1 });
    setBuyMessage('');
  };

  const closeBuyModal = () => {
    setBuyModal({ show: false, productId: null, quantity: 1 });
    setBuyMessage('');
  };

  const handleBuyProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${buyModal.productId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity: parseInt(buyModal.quantity) }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBuyMessage(`❌ ${data.message}`);
        return;
      }

      setBuyMessage(
        `✅ Successfully purchased ${buyModal.quantity} unit(s)!\nTotal: $${data.product.totalPrice.toFixed(2)}`
      );
      setTimeout(() => {
        fetchProducts();
        closeBuyModal();
      }, 1500);
    } catch (err) {
      setBuyMessage('❌ Error processing purchase');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      category: '',
      price: '',
      quantity: '',
      minStockLevel: 10,
      maxStockLevel: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const canModifyProducts = ['Admin', 'Store Manager'].includes(user?.role);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        {canModifyProducts && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && canModifyProducts && (
        <div className="product-form">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Min Stock Level</label>
                <input
                  type="number"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success">
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      <div className="products-list">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                {canModifyProducts && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className={product.isLowStock ? 'low-stock' : ''}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.isLowStock ? (
                      <span className="badge warning">⚠️ Low Stock</span>
                    ) : (
                      <span className="badge success">✓ In Stock</span>
                    )}
                  </td>
                  {canModifyProducts && (
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn-small btn-edit"
                      >
                        Edit
                      </button>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn-small btn-delete"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                  {!canModifyProducts && (
                    <td className="actions">
                      <button
                        onClick={() => openBuyModal(product._id)}
                        className="btn-small btn-buy"
                        disabled={product.quantity === 0}
                      >
                        🛒 Buy
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Buy Modal */}
      {buyModal.show && (
        <div className="modal-overlay" onClick={closeBuyModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛒 Purchase Product</h2>
              <button className="close-btn" onClick={closeBuyModal}>✕</button>
            </div>
            <div className="modal-body">
              {buyMessage ? (
                <div className={`buy-message ${buyMessage.includes('✅') ? 'success' : 'error'}`}>
                  {buyMessage}
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Quantity to Buy:</label>
                    <input
                      type="number"
                      min="1"
                      max={
                        products.find((p) => p._id === buyModal.productId)?.quantity || 1
                      }
                      value={buyModal.quantity}
                      onChange={(e) =>
                        setBuyModal({ ...buyModal, quantity: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <p>
                      <strong>Available:</strong>{' '}
                      {products.find((p) => p._id === buyModal.productId)?.quantity} units
                    </p>
                    <p>
                      <strong>Unit Price:</strong> $
                      {products
                        .find((p) => p._id === buyModal.productId)
                        ?.price.toFixed(2)}
                    </p>
                    <p>
                      <strong>Total Price:</strong> $
                      {(
                        (products.find((p) => p._id === buyModal.productId)?.price || 0) *
                        buyModal.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
            {!buyMessage && (
              <div className="modal-footer">
                <button onClick={closeBuyModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleBuyProduct} className="btn btn-success">
                  Confirm Purchase
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;