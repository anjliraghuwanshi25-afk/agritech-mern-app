import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  ShieldCheck,
  Users,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Package,
  Truck,
  CheckCircle,
} from 'lucide-react';

const ORDER_STATUS_OPTIONS = [
  'Order Placed',
  'Confirmed & Packed',
  'Dispatched',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // New product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Seeds',
    price: '',
    originalPrice: '',
    stock: 50,
    unit: 'Per Unit',
    brand: 'AgriTech Certified',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=500&q=80',
    suitableFor: 'Wheat, Paddy',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        API.get('/admin/metrics'),
        API.get('/admin/users'),
        API.get('/products'),
        API.get('/orders/admin/all'),
      ]);

      setMetrics(metricsRes.data?.data || null);
      setUsers(usersRes.data?.data || []);
      setProducts(productsRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Administrative status update to ${newStatus}`,
      });
      if (res.data?.success) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const targetRole = currentRole === 'admin' ? 'farmer' : 'admin';
    if (window.confirm(`Change role to ${targetRole}?`)) {
      try {
        const res = await API.put(`/admin/users/${userId}/role`, { role: targetRole });
        if (res.data?.success) {
          setUsers(users.map((u) => (u._id === userId ? { ...u, role: targetRole } : u)));
        }
      } catch (err) {
        alert('Failed to update role');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user? All their farms and crops will also be purged.')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setUsers(users.filter((u) => u._id !== userId));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/products', {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price),
        stock: Number(newProduct.stock),
        suitableFor: newProduct.suitableFor.split(',').map((s) => s.trim()),
      });
      if (res.data?.success) {
        setShowProductModal(false);
        setNewProduct({
          name: '',
          category: 'Seeds',
          price: '',
          originalPrice: '',
          stock: 50,
          unit: 'Per Unit',
          brand: 'AgriTech Certified',
          description: '',
          imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=500&q=80',
          suitableFor: 'Wheat, Paddy',
        });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Remove this product from the agri store catalogue?')) {
      try {
        await API.delete(`/products/${productId}`);
        setProducts(products.filter((p) => p._id !== productId));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded-4 shadow-sm border mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h3 className="fw-bold text-dark mb-0">AgriTech Administrative Control Center</h3>
            <span className="badge bg-warning text-dark fw-bold d-flex align-items-center gap-1">
              <ShieldCheck size={14} /> Full Access
            </span>
          </div>
          <p className="text-muted small mb-0">
            System overview, farmer profiles, agro-resource inventory, and order fulfillment logistics.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-agri btn-sm fw-semibold d-flex align-items-center gap-1"
            onClick={() => setShowProductModal(true)}
          >
            <Plus size={16} /> Add Store Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 border shadow-sm gap-2">
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'overview' ? 'active bg-success fw-bold' : 'text-dark'}`}
            onClick={() => setActiveTab('overview')}
          >
            Metrics Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'users' ? 'active bg-success fw-bold' : 'text-dark'}`}
            onClick={() => setActiveTab('users')}
          >
            Farmers Directory ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'products' ? 'active bg-success fw-bold' : 'text-dark'}`}
            onClick={() => setActiveTab('products')}
          >
            Store Inventory ({products.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'orders' ? 'active bg-success fw-bold' : 'text-dark'}`}
            onClick={() => setActiveTab('orders')}
          >
            Order Fulfillment Station ({orders.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && metrics && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-lg-4">
                  <div className="agri-card p-3 border-0 bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small fw-semibold">Registered Farmers</span>
                        <h2 className="fw-bold text-dark mb-0 mt-1">{metrics.totalFarmers}</h2>
                        <small className="text-success fw-semibold">Across multiple states</small>
                      </div>
                      <div className="bg-success-subtle text-success p-3 rounded-circle">
                        <Users size={28} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-4">
                  <div className="agri-card p-3 border-0 bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small fw-semibold">Active Farm Parcels</span>
                        <h2 className="fw-bold text-dark mb-0 mt-1">{metrics.totalFarms}</h2>
                        <small className="text-primary fw-semibold">{metrics.totalCrops} Crops Monitored</small>
                      </div>
                      <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                        <Layers size={28} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-4">
                  <div className="agri-card p-3 border-0 bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small fw-semibold">Platform Resource Sales</span>
                        <h2 className="fw-bold text-success mb-0 mt-1">₹ {metrics.totalRevenue?.toLocaleString()}</h2>
                        <small className="text-secondary fw-semibold">{metrics.totalOrders} Consignments</small>
                      </div>
                      <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                        <ShoppingBag size={28} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="agri-card p-4 bg-white shadow-sm border mb-4">
                <h5 className="fw-bold text-dark mb-3">Recent Consignment Orders</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Farmer</th>
                        <th>Items Count</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Placed On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.recentOrders?.map((ord) => (
                        <tr key={ord._id}>
                          <td className="fw-bold text-success">#{ord._id.slice(-6)}</td>
                          <td>{ord.user?.name || 'Farmer Customer'}</td>
                          <td>{ord.orderItems?.length || 1} items</td>
                          <td className="fw-bold">₹ {ord.totalAmount?.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-success">{ord.orderStatus}</span>
                          </td>
                          <td className="small text-muted">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FARMERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="agri-card p-4 bg-white shadow-sm border">
              <h5 className="fw-bold text-dark mb-3">Farmer & Administrator Directory</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User Profile</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Role</th>
                      <th>Registered</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={usr.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=80&q=80'}
                              alt={usr.name}
                              className="rounded-circle"
                              style={{ width: 32, height: 32, objectFit: 'cover' }}
                            />
                            <span className="fw-bold text-dark">{usr.name}</span>
                          </div>
                        </td>
                        <td className="small text-muted">{usr.email}</td>
                        <td className="small">{usr.phone || 'N/A'}</td>
                        <td className="small">{usr.location || 'Punjab, India'}</td>
                        <td>
                          <span className={`badge ${usr.role === 'admin' ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="small text-muted">{new Date(usr.createdAt).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => handleToggleUserRole(usr._id, usr.role)}
                            title="Toggle Admin / Farmer Role"
                          >
                            Switch Role
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteUser(usr._id)}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STORE INVENTORY */}
          {activeTab === 'products' && (
            <div className="agri-card p-4 bg-white shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Agri Resource Catalogue & Inventory</h5>
                <button
                  className="btn btn-agri btn-sm fw-bold"
                  onClick={() => setShowProductModal(true)}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Quantity</th>
                      <th>Unit Packaging</th>
                      <th>Rating</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="rounded border"
                              style={{ width: 40, height: 40, objectFit: 'cover' }}
                            />
                            <div>
                              <strong className="d-block text-dark">{p.name}</strong>
                              <small className="text-muted">{p.brand}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{p.category}</span>
                        </td>
                        <td className="fw-bold text-success">₹ {p.price?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                            {p.stock} Units
                          </span>
                        </td>
                        <td className="small">{p.unit}</td>
                        <td className="small">⭐ {p.rating} ({p.numReviews})</td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDER FULFILLMENT STATION */}
          {activeTab === 'orders' && (
            <div className="agri-card p-4 bg-white shadow-sm border">
              <h5 className="fw-bold text-dark mb-3">Order Fulfillment & Logistics Station</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Farmer / Consignee</th>
                      <th>Delivery Destination</th>
                      <th>Total Value</th>
                      <th>Payment</th>
                      <th>Fulfillment Status</th>
                      <th>Change Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id}>
                        <td className="fw-bold text-success">#{ord._id.slice(-6)}</td>
                        <td>
                          <div>
                            <strong className="d-block">{ord.shippingAddress?.fullName || 'Farmer'}</strong>
                            <small className="text-muted">{ord.shippingAddress?.phone}</small>
                          </div>
                        </td>
                        <td className="small">
                          {ord.shippingAddress?.villageOrCity}, {ord.shippingAddress?.district}
                        </td>
                        <td className="fw-bold">₹ {ord.totalAmount?.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ord.orderStatus === 'Delivered' ? 'bg-success' : ord.orderStatus === 'Dispatched' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          >
                            {ORDER_STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal: Add New Product */}
      {showProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-agri-primary text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={20} /> Add Product to Agri Store Catalogue
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateProduct}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Certified Bio-NPK Granules"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Pesticides & Bio-agents">Pesticides & Bio-agents</option>
                        <option value="Machinery & Tools">Machinery & Tools</option>
                        <option value="Irrigation Equipment">Irrigation Equipment</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Selling Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 850"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Original Price / MRP (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 1100"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Stock Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Packaging Unit (e.g. 25 kg Bag, 1 Liter) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Brand / Manufacturer</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Suitable Crops (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.suitableFor}
                        onChange={(e) => setNewProduct({ ...newProduct, suitableFor: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description *</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm fw-bold px-4">
                    Publish Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
