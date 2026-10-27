const mongoose = require('mongoose');

const weatherAlertSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      default: 'North Zone (Punjab, Haryana, UP)',
    },
    temperature: {
      type: Number,
      default: 28, // Celsius
    },
    humidity: {
      type: Number,
      default: 68, // Percentage
    },
    rainfallProbability: {
      type: Number,
      default: 45, // Percentage
    },
    windSpeed: {
      type: Number,
      default: 14, // km/h
    },
    condition: {
      type: String,
      enum: ['Sunny', 'Partly Cloudy', 'Rainy', 'Thunderstorm', 'Humid', 'Foggy'],
      default: 'Partly Cloudy',
    },
    forecast: [
      {
        day: { type: String, required: true },
        tempMin: { type: Number, required: true },
        tempMax: { type: Number, required: true },
        condition: { type: String, required: true },
        rainChance: { type: Number, required: true },
      },
    ],
    pestAlerts: [
      {
        pestName: { type: String, required: true },
        severity: {
          type: String,
          enum: ['Low', 'Moderate', 'Severe'],
          default: 'Moderate',
        },
        affectedCrops: [{ type: String }],
        symptoms: { type: String },
        preventativeMeasures: { type: String, required: true },
        broadcastDate: { type: Date, default: Date.now },
        active: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WeatherAlert', weatherAlertSchema);
