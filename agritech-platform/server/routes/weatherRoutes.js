const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getPestAlerts,
  createPestAlert,
  deletePestAlert,
} = require('../controllers/weatherController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCurrentWeather);
router.get('/pest-alerts', getPestAlerts);
router.post('/pest-alerts', protect, adminOnly, createPestAlert);
router.delete('/pest-alerts/:alertId', protect, adminOnly, deletePestAlert);

module.exports = router;
