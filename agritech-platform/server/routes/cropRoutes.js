const express = require('express');
const router = express.Router();
const {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropSoilAdvisory,
} = require('../controllers/cropController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCrops)
  .post(protect, createCrop);

router.route('/:id')
  .get(protect, getCropById)
  .put(protect, updateCrop)
  .delete(protect, deleteCrop);

router.get('/:id/advisory', protect, getCropSoilAdvisory);

module.exports = router;
