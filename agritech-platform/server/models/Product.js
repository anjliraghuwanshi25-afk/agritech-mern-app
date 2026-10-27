const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: [
        'Seeds',
        'Fertilizers',
        'Pesticides & Bio-agents',
        'Machinery & Tools',
        'Irrigation Equipment',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      default: 50,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'Per unit',
    },
    brand: {
      type: String,
      default: 'AgriTech Certified',
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=500&q=80',
    },
    rating: {
      type: Number,
      default: 4.6,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 18,
    },
    suitableFor: [
      {
        type: String,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
