const express = require('express');
const router = express.Router();
const {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getFarms)
  .post(protect, createFarm);

router.route('/:id')
  .get(protect, getFarmById)
  .put(protect, updateFarm)
  .delete(protect, deleteFarm);

module.exports = router;
