const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        unit: { type: String, default: 'unit' },
        imageUrl: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      villageOrCity: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true, default: 'Punjab' },
      pinCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'UPI / NetBanking', 'Kisan Credit Card (KCC)'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Refunded'],
      default: 'Completed',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: [
        'Order Placed',
        'Confirmed & Packed',
        'Dispatched',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order Placed',
    },
    trackingTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    estimatedDelivery: {
      type: Date,
      default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // +4 days
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
