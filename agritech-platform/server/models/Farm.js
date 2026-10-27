const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmName: {
      type: String,
      required: [true, 'Please provide farm name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please specify location (Village, District, State)'],
      trim: true,
    },
    totalArea: {
      type: Number,
      required: [true, 'Please specify total area of the farm'],
      min: [0.1, 'Farm area must be at least 0.1'],
    },
    areaUnit: {
      type: String,
      enum: ['Acres', 'Hectares', 'Bigha'],
      default: 'Acres',
    },
    soilType: {
      type: String,
      enum: [
        'Alluvial Soil',
        'Black Soil (Regur)',
        'Red & Yellow Soil',
        'Clay Soil',
        'Sandy Loam',
        'Laterite Soil',
      ],
      default: 'Alluvial Soil',
    },
    irrigationType: {
      type: String,
      enum: [
        'Drip Irrigation',
        'Sprinkler System',
        'Canal Irrigation',
        'Tube Well',
        'Rainfed',
      ],
      default: 'Drip Irrigation',
    },
    status: {
      type: String,
      enum: ['Active', 'Fallow', 'Prepared for Sowing'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farm', farmSchema);
