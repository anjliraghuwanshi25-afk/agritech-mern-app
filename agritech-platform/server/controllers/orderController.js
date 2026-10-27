const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address and contact phone are required',
      });
    }

    // Verify stock and calculate verified total
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          if (product.stock === 0) {
            product.inStock = false;
          }
          await product.save();
        }
      }
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Completed',
      totalAmount,
      orderStatus: 'Order Placed',
      trackingTimeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          note: 'Your agricultural supply order has been received and registered.',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Tracking initiated.',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private / Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone location')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status & add tracking entry
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status || order.orderStatus;
    order.trackingTimeline.push({
      status: status || order.orderStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    const updatedOrder = await order.save();
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
