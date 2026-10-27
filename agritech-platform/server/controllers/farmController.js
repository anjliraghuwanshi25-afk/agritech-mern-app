const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// @desc    Get all farms for logged in user (or all if admin)
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    const farms = await Farm.find(query).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single farm by ID with associated crops
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('user', 'name email location');
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    // Check ownership or admin
    if (farm.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this farm' });
    }

    const crops = await Crop.find({ farm: farm._id }).sort({ createdAt: -1 });

    res.json({ success: true, data: { farm, crops } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
  try {
    const { farmName, location, totalArea, areaUnit, soilType, irrigationType, status, notes } = req.body;

    if (!farmName || !location || !totalArea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm name, location, and total area',
      });
    }

    const farm = await Farm.create({
      user: req.user._id,
      farmName,
      location,
      totalArea,
      areaUnit: areaUnit || 'Acres',
      soilType: soilType || 'Alluvial Soil',
      irrigationType: irrigationType || 'Drip Irrigation',
      status: status || 'Active',
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Farm registered successfully', data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this farm' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Farm updated successfully', data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this farm' });
    }

    // Delete associated crops as well
    await Crop.deleteMany({ farm: farm._id });
    await farm.deleteOne();

    res.json({ success: true, message: 'Farm and associated crops removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFarms, getFarmById, createFarm, updateFarm, deleteFarm };
