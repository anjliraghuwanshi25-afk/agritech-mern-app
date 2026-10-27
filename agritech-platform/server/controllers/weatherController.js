const WeatherAlert = require('../models/WeatherAlert');

// Default simulated agro-weather data fallback
const defaultWeather = {
  region: 'North Agricultural Zone (Punjab / Haryana)',
  temperature: 29,
  humidity: 64,
  rainfallProbability: 40,
  windSpeed: 12,
  condition: 'Partly Cloudy',
  forecast: [
    { day: 'Mon', tempMin: 22, tempMax: 32, condition: 'Sunny', rainChance: 10 },
    { day: 'Tue', tempMin: 23, tempMax: 31, condition: 'Partly Cloudy', rainChance: 25 },
    { day: 'Wed', tempMin: 21, tempMax: 29, condition: 'Rainy', rainChance: 70 },
    { day: 'Thu', tempMin: 20, tempMax: 28, condition: 'Thunderstorm', rainChance: 85 },
    { day: 'Fri', tempMin: 22, tempMax: 30, condition: 'Humid', rainChance: 30 },
  ],
  pestAlerts: [
    {
      pestName: 'Fall Armyworm (Spodoptera frugiperda)',
      severity: 'Severe',
      affectedCrops: ['Maize', 'Sorghum', 'Sugarcane'],
      symptoms: 'Pin-hole feeding marks on young leaves and heavy skeletonization of whorls.',
      preventativeMeasures: 'Deploy pheromone traps (5/acre). Spray neem oil (1500 ppm @ 5ml/L) or Emamectin Benzoate 5% SG.',
      active: true,
    },
    {
      pestName: 'Yellow Stem Borer',
      severity: 'Moderate',
      affectedCrops: ['Paddy (Rice)'],
      symptoms: 'Dead heart in vegetative stage and white earheads at flowering stage.',
      preventativeMeasures: 'Release Trichogramma japonicum egg parasitoids. Apply Chlorantraniliprole 0.4% G.',
      active: true,
    },
    {
      pestName: 'Mustard Aphid (Lipaphis erysimi)',
      severity: 'Low',
      affectedCrops: ['Mustard', 'Rapeseed'],
      symptoms: 'Curling of tender leaves and honeydew secretion with black sooty mold.',
      preventativeMeasures: 'Spray Dimethoate 30 EC or Verticillium lecanii bio-agent.',
      active: true,
    },
  ],
};

// @desc    Get current weather and 5-day forecast
// @route   GET /api/weather
// @access  Public
const getCurrentWeather = async (req, res) => {
  try {
    let weather = await WeatherAlert.findOne().sort({ updatedAt: -1 });

    if (!weather) {
      weather = await WeatherAlert.create(defaultWeather);
    }

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active pest alerts
// @route   GET /api/weather/pest-alerts
// @access  Public
const getPestAlerts = async (req, res) => {
  try {
    const weather = await WeatherAlert.findOne().sort({ updatedAt: -1 });
    const alerts = weather ? weather.pestAlerts.filter((a) => a.active) : defaultWeather.pestAlerts;

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / broadcast new pest alert
// @route   POST /api/weather/pest-alerts
// @access  Private / Admin
const createPestAlert = async (req, res) => {
  try {
    const { pestName, severity, affectedCrops, symptoms, preventativeMeasures } = req.body;

    if (!pestName || !preventativeMeasures) {
      return res.status(400).json({
        success: false,
        message: 'Please provide pest name and preventative measures',
      });
    }

    let weather = await WeatherAlert.findOne().sort({ updatedAt: -1 });
    if (!weather) {
      weather = new WeatherAlert(defaultWeather);
    }

    const newAlert = {
      pestName,
      severity: severity || 'Moderate',
      affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
      symptoms: symptoms || 'Foliage and stem damage noticed in localized zones.',
      preventativeMeasures,
      broadcastDate: new Date(),
      active: true,
    };

    weather.pestAlerts.unshift(newAlert);
    await weather.save();

    res.status(201).json({
      success: true,
      message: 'Pest alert broadcasted to all farmers successfully',
      data: newAlert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / deactivate pest alert
// @route   DELETE /api/weather/pest-alerts/:alertId
// @access  Private / Admin
const deletePestAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const weather = await WeatherAlert.findOne().sort({ updatedAt: -1 });

    if (!weather) {
      return res.status(404).json({ success: false, message: 'Weather record not found' });
    }

    weather.pestAlerts = weather.pestAlerts.filter((a) => a._id.toString() !== alertId);
    await weather.save();

    res.json({ success: true, message: 'Pest alert removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCurrentWeather,
  getPestAlerts,
  createPestAlert,
  deletePestAlert,
};
