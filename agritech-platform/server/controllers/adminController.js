const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const WeatherAlert = require('../models/WeatherAlert');

// @desc    Get aggregated metrics & system statistics for Admin Dashboard
// @route   GET /api/admin/metrics
// @access  Private / Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalFarms = await Farm.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total sales revenue
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const weatherDoc = await WeatherAlert.findOne().sort({ updatedAt: -1 });
    const activePestAlerts = weatherDoc ? weatherDoc.pestAlerts.filter((a) => a.active).length : 0;

    // Recent orders preview
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent farmers
    const recentFarmers = await User.find({ role: 'farmer' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarmers,
        totalFarms,
        totalCrops,
        totalProducts,
        totalOrders,
        totalRevenue,
        activePestAlerts,
        recentOrders,
        recentFarmers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with profile data
// @route   GET /api/admin/users
// @access  Private / Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (e.g. promote to admin or expert)
// @route   PUT /api/admin/users/:id/role
// @access  Private / Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role || user.role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${user.role}`,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private / Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    await Farm.deleteMany({ user: user._id });
    await Crop.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ success: true, message: 'User and their related records deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
