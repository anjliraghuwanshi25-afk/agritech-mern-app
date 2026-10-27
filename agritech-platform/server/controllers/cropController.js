const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// Helper to compute smart soil health analysis and recommendations
const generateSoilAdvisory = (cropName, soilHealth) => {
  const recommendations = [];
  let overallScore = 100;

  const { nitrogen, phosphorus, potassium, soilPh, moisturePercentage, organicCarbon } = soilHealth;

  // Nitrogen (optimal 280 - 450 kg/ha)
  if (nitrogen < 280) {
    recommendations.push({
      parameter: 'Nitrogen (N)',
      status: 'Low',
      value: `${nitrogen} kg/ha`,
      action: 'Apply Neem-coated Urea or well-decomposed Farmyard Manure (FYM) in split doses.',
    });
    overallScore -= 15;
  } else if (nitrogen > 500) {
    recommendations.push({
      parameter: 'Nitrogen (N)',
      status: 'High',
      value: `${nitrogen} kg/ha`,
      action: 'Avoid additional nitrogen fertilizers to prevent excessive vegetative growth and pest vulnerability.',
    });
    overallScore -= 10;
  } else {
    recommendations.push({
      parameter: 'Nitrogen (N)',
      status: 'Optimal',
      value: `${nitrogen} kg/ha`,
      action: 'Nitrogen levels are healthy. Maintain standard top-dressing schedule.',
    });
  }

  // Phosphorus (optimal 20 - 40 kg/ha)
  if (phosphorus < 20) {
    recommendations.push({
      parameter: 'Phosphorus (P)',
      status: 'Deficient',
      value: `${phosphorus} kg/ha`,
      action: 'Incorporate DAP (Diammonium Phosphate) or Single Super Phosphate (SSP) near root zones.',
    });
    overallScore -= 15;
  } else {
    recommendations.push({
      parameter: 'Phosphorus (P)',
      status: 'Sufficient',
      value: `${phosphorus} kg/ha`,
      action: 'Adequate phosphorus present for robust root development and tillering.',
    });
  }

  // Potassium (optimal 150 - 280 kg/ha)
  if (potassium < 150) {
    recommendations.push({
      parameter: 'Potassium (K)',
      status: 'Low',
      value: `${potassium} kg/ha`,
      action: 'Apply Muriate of Potash (MOP) to enhance pest resistance, drought tolerance, and grain filling.',
    });
    overallScore -= 15;
  } else {
    recommendations.push({
      parameter: 'Potassium (K)',
      status: 'Optimal',
      value: `${potassium} kg/ha`,
      action: 'Good potassium reserve. Promotes healthy stalk strength and pest defense.',
    });
  }

  // Soil pH (optimal 6.0 - 7.5)
  if (soilPh < 6.0) {
    recommendations.push({
      parameter: 'Soil pH',
      status: 'Acidic',
      value: soilPh,
      action: 'Soil is acidic. Broadcast agricultural limestone (CaCO3) to neutralize acidity.',
    });
    overallScore -= 15;
  } else if (soilPh > 7.8) {
    recommendations.push({
      parameter: 'Soil pH',
      status: 'Alkaline',
      value: soilPh,
      action: 'Soil is alkaline/saline. Apply gypsum (calcium sulphate) and incorporate organic green manuring.',
    });
    overallScore -= 15;
  } else {
    recommendations.push({
      parameter: 'Soil pH',
      status: 'Neutral / Balanced',
      value: soilPh,
      action: 'Ideal pH range for nutrient availability and microbial activity.',
    });
  }

  // Moisture Percentage (optimal 50% - 75%)
  if (moisturePercentage < 40) {
    recommendations.push({
      parameter: 'Soil Moisture',
      status: 'Critical Low',
      value: `${moisturePercentage}%`,
      action: 'High water stress! Schedule drip irrigation or furrow watering within 24 hours.',
    });
    overallScore -= 20;
  } else if (moisturePercentage > 85) {
    recommendations.push({
      parameter: 'Soil Moisture',
      status: 'Waterlogged',
      value: `${moisturePercentage}%`,
      action: 'Risk of aeration loss and root rot! Clear field drainage channels immediately.',
    });
    overallScore -= 15;
  } else {
    recommendations.push({
      parameter: 'Soil Moisture',
      status: 'Optimal',
      value: `${moisturePercentage}%`,
      action: 'Adequate soil water retention. No immediate irrigation needed.',
    });
  }

  let healthGrade = 'Optimal';
  if (overallScore < 60) healthGrade = 'Critical';
  else if (overallScore < 80) healthGrade = 'Needs Attention';
  else if (overallScore < 90) healthGrade = 'Good';

  return {
    cropName,
    overallScore: Math.max(overallScore, 30),
    healthGrade,
    recommendations,
  };
};

// @desc    Get all crops for user (or all if admin)
// @route   GET /api/crops
// @access  Private
const getCrops = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    if (req.query.farmId) {
      query.farm = req.query.farmId;
    }

    const crops = await Crop.find(query)
      .populate('farm', 'farmName location soilType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farm').populate('user', 'name');
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this crop' });
    }

    const advisory = generateSoilAdvisory(crop.cropName, crop.soilHealth);

    res.json({ success: true, data: { crop, advisory } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new crop record
// @route   POST /api/crops
// @access  Private
const createCrop = async (req, res) => {
  try {
    const {
      farmId,
      cropName,
      cropCategory,
      variety,
      areaPlanted,
      plantingDate,
      expectedHarvestDate,
      stage,
      healthStatus,
      soilHealth,
      pestThreatLevel,
      advisoryNotes,
    } = req.body;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to add crop to this farm' });
    }

    const crop = await Crop.create({
      user: req.user._id,
      farm: farmId,
      cropName,
      cropCategory: cropCategory || 'Cereal',
      variety: variety || 'High-Yielding',
      areaPlanted: areaPlanted || 1,
      plantingDate: plantingDate || Date.now(),
      expectedHarvestDate: expectedHarvestDate || new Date(Date.now() + 110 * 24 * 60 * 60 * 1000),
      stage: stage || 'Vegetative',
      healthStatus: healthStatus || 'Good',
      soilHealth: soilHealth || {
        nitrogen: 320,
        phosphorus: 24,
        potassium: 210,
        soilPh: 6.8,
        moisturePercentage: 65,
        organicCarbon: 0.85,
      },
      pestThreatLevel: pestThreatLevel || 'Low',
      advisoryNotes: advisoryNotes || 'Initial baseline setup complete.',
    });

    res.status(201).json({ success: true, message: 'Crop registered successfully', data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop (stage, soil tests, health)
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this crop' });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Crop updated successfully', data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this crop' });
    }

    await crop.deleteOne();
    res.json({ success: true, message: 'Crop record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed soil advisory for a crop
// @route   GET /api/crops/:id/advisory
// @access  Private
const getCropSoilAdvisory = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    const advisory = generateSoilAdvisory(crop.cropName, crop.soilHealth);
    res.json({ success: true, data: advisory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropSoilAdvisory,
};
