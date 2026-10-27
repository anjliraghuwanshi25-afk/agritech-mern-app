import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  Package,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

const ORDER_STAGES = [
  'Order Placed',
  'Confirmed & Packed',
  'Dispatched',
  'Out for Delivery',
  'Delivered',
];

const OrdersPage = () => {
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '+91 98765 43210',
    address: 'Plot #14, Near Canal Road',
    villageOrCity: 'Samrala Block',
    district: 'Ludhiana',
    state: 'Punjab',
    pinCode: '141114',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await API.get('/orders/my-orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load farmer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setSubmittingOrder(true);
    try {
      const formattedItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit,
        imageUrl: item.product.imageUrl,
      }));

      const res = await API.post('/orders', {
        orderItems: formattedItems,
        shippingAddress,
        paymentMethod,
        totalAmount: cartTotal,
      });

      if (res.data?.success) {
        setOrderSuccess(res.data.data);
        clearCart();
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const getStageIndex = (status) => {
    const idx = ORDER_STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
          <Truck className="text-success" /> Resource Orders & Live Consignment Tracking
        </h3>
        <p className="text-muted small mb-0">
          Review cart items, checkout farming inputs, and track regional delivery logistics in real-time.
        </p>
      </div>

      {orderSuccess && (
        <div className="alert alert-success p-4 rounded-3 shadow-sm mb-4 border-success">
          <div className="d-flex align-items-center gap-3">
            <CheckCircle size={32} className="text-success flex-shrink-0" />
            <div>
              <h5 className="fw-bold text-success mb-1">
                Order Placed Successfully! (Order #{orderSuccess._id?.slice(-6)})
              </h5>
              <p className="mb-0 small text-dark">
                Your order for ₹ {orderSuccess.totalAmount?.toLocaleString()} is registered. Tracking initiated below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Section */}
      <div className="row g-4 mb-5">
        {/* Left: Cart Items */}
        <div className="col-lg-7">
          <div className="agri-card p-4 bg-white shadow-sm border h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Shopping Cart ({cartItems.length} items)</h5>
              {cartItems.length > 0 && (
                <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                  Clear All
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <ShoppingBag size={42} className="text-muted mb-2" />
                <p className="text-muted small mb-3">Your shopping cart is empty.</p>
                <a href="/marketplace" className="btn btn-agri btn-sm">
                  Browse Agri Products
                </a>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between flex-wrap gap-2"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="rounded border"
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="fw-bold text-dark mb-1">{item.product.name}</h6>
                        <small className="text-muted">
                          ₹ {item.product.price} / {item.product.unit}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="input-group input-group-sm" style={{ width: 100 }}>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="input-group-text bg-white fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-end" style={{ minWidth: 80 }}>
                        <span className="fw-bold text-dark">
                          ₹ {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm border-0"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-top mt-2">
                  <div className="d-flex justify-content-between mb-1 small text-muted">
                    <span>Subtotal:</span>
                    <span>₹ {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small text-muted">
                    <span>Agricultural Subsidy Shipping:</span>
                    <span className="text-success fw-bold">FREE (Kisan Hub Deliveries)</span>
                  </div>
                  <div className="d-flex justify-content-between fs-5 fw-bold text-dark pt-2 border-top">
                    <span>Total Amount Payable:</span>
                    <span className="text-success">₹ {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Shipping Address & Order Submission */}
        <div className="col-lg-5">
          <div className="agri-card p-4 bg-white shadow-sm border">
            <h5 className="fw-bold text-dark mb-3">Shipping & Rural Delivery Address</h5>

            <form onSubmit={handleCheckout}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Farmer Full Name *</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Contact Mobile Phone *</label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Plot / House Address & Landmark *</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Village / City *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.villageOrCity}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, villageOrCity: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">District *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">State *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">PIN Code *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.pinCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pinCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-4">
                <label className="form-label small fw-semibold">Payment Option</label>
                <div className="d-flex flex-column gap-2">
                  <label className="p-2 border rounded-2 d-flex align-items-center gap-2 cursor-pointer bg-light">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="small fw-semibold">Cash on Delivery (Pay upon arrival)</span>
                  </label>
                  <label className="p-2 border rounded-2 d-flex align-items-center gap-2 cursor-pointer bg-light">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI / NetBanking"
                      checked={paymentMethod === 'UPI / NetBanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="small fw-semibold">UPI / QR Code / NetBanking</span>
                  </label>
                  <label className="p-2 border rounded-2 d-flex align-items-center gap-2 cursor-pointer bg-light">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Kisan Credit Card (KCC)"
                      checked={paymentMethod === 'Kisan Credit Card (KCC)'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="small fw-semibold">Kisan Credit Card (KCC Subsidized)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-agri w-100 py-2 fw-bold"
                disabled={cartItems.length === 0 || submittingOrder}
              >
                {submittingOrder ? 'Processing Dispatch...' : `Confirm Order (₹ ${cartTotal.toLocaleString()})`}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Live Order Tracking History */}
      <div className="agri-card p-4 bg-white shadow-sm border">
        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <Package className="text-success" /> Live Order Tracking & History ({orders.length})
        </h5>

        {loadingOrders ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-muted small mb-0 text-center py-4">No previous orders found.</p>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((ord) => {
              const currentStageIdx = getStageIndex(ord.orderStatus);
              return (
                <div key={ord._id} className="p-4 border rounded-3 bg-light">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
                    <div>
                      <span className="fw-bold text-dark fs-6">Order #{ord._id.slice(-6)}</span>
                      <span className="text-muted small ms-2">
                        • {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="badge bg-success me-2">{ord.orderStatus}</span>
                      <strong className="text-success">₹ {ord.totalAmount?.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Visual Progress Stepper Bar */}
                  <div className="my-4">
                    <div className="position-relative m-4">
                      <div
                        className="progress"
                        style={{ height: 4 }}
                      >
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{
                            width: `${(currentStageIdx / (ORDER_STAGES.length - 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y">
                        {ORDER_STAGES.map((stg, sIdx) => {
                          const isDone = sIdx <= currentStageIdx;
                          return (
                            <div key={stg} className="text-center" style={{ transform: 'translateX(-50%)' }}>
                              <div
                                className={`rounded-circle d-inline-flex align-items-center justify-content-center border border-2 ${
                                  isDone ? 'bg-success text-white border-success' : 'bg-white text-muted border-secondary'
                                }`}
                                style={{ width: 24, height: 24, fontSize: '0.75rem' }}
                              >
                                {isDone ? '✓' : sIdx + 1}
                              </div>
                              <div
                                className={`small mt-1 d-none d-sm-block ${
                                  isDone ? 'fw-bold text-success' : 'text-muted'
                                }`}
                                style={{ fontSize: '0.75rem' }}
                              >
                                {stg}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Consignment Items Summary */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold small text-secondary mb-2">Package Contents:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {ord.orderItems?.map((item, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border small d-flex align-items-center gap-2">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=100&q=80'}
                            alt={item.name}
                            style={{ width: 30, height: 30, objectFit: 'cover' }}
                            className="rounded"
                          />
                          <span>
                            <strong>{item.name}</strong> × {item.quantity} ({item.unit})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Timeline Log */}
                  {ord.trackingTimeline?.length > 0 && (
                    <div className="mt-3 pt-3 border-top small">
                      <strong className="text-dark d-block mb-2">Logistics Milestone Log:</strong>
                      <div className="d-flex flex-column gap-1">
                        {ord.trackingTimeline.map((log, lIdx) => (
                          <div key={lIdx} className="text-muted">
                            <span className="text-dark fw-semibold">• {log.status}</span> ({new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) : {log.note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
