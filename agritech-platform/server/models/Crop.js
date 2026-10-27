const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Please enter crop name'],
      trim: true,
    },
    cropCategory: {
      type: String,
      enum: ['Cereal', 'Pulse', 'Cash Crop', 'Vegetable', 'Fruit', 'Oilseed'],
      default: 'Cereal',
    },
    variety: {
      type: String,
      default: 'Standard Hybrid',
    },
    areaPlanted: {
      type: Number,
      required: [true, 'Please enter area planted (Acres)'],
      default: 1,
    },
    plantingDate: {
      type: Date,
      required: [true, 'Please enter planting date'],
      default: Date.now,
    },
    expectedHarvestDate: {
      type: Date,
    },
    stage: {
      type: String,
      enum: [
        'Sowing',
        'Germination',
        'Vegetative',
        'Flowering',
        'Yield Formation',
        'Ripening',
        'Harvested',
      ],
      default: 'Vegetative',
    },
    healthStatus: {
      type: String,
      enum: ['Optimal', 'Good', 'Needs Attention', 'Critical'],
      default: 'Good',
    },
    soilHealth: {
      nitrogen: {
        type: Number, // mg/kg or index (normal 250-450)
        default: 320,
      },
      phosphorus: {
        type: Number, // kg/ha (normal 15-30)
        default: 24,
      },
      potassium: {
        type: Number, // kg/ha (normal 150-250)
        default: 210,
      },
      soilPh: {
        type: Number, // 0-14 (ideal 6.0-7.5)
        default: 6.8,
      },
      moisturePercentage: {
        type: Number, // 0-100%
        default: 65,
      },
      organicCarbon: {
        type: Number, // % (ideal >0.75%)
        default: 0.85,
      },
    },
    pestThreatLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Low',
    },
    advisoryNotes: {
      type: String,
      default: 'Crop growth parameters are within optimal ranges. Regular irrigation advised.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);
