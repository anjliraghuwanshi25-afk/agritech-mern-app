const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const WeatherAlert = require('../models/WeatherAlert');
const ForumThread = require('../models/ForumThread');

dotenv.config({ path: `${__dirname}/../.env` });

const seedDatabase = async (exitOnComplete = true) => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech';
    if (mongoose.connection.readyState === 0) {
      try {
        console.log(`Connecting to MongoDB at: ${mongoUri}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('🌱 Connected to MongoDB for seeding.');
      } catch (err) {
        console.log('⚠️ Local MongoDB not running. Using MongoMemoryServer for seeding...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
        console.log('🌱 Connected to embedded MongoMemoryServer for seeding.');
      }
    }

    // Clear old collections
    console.log('Clearing existing records...');
    await User.deleteMany();
    await Farm.deleteMany();
    await Crop.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await WeatherAlert.deleteMany();
    await ForumThread.deleteMany();

    console.log('Seeding demo users...');
    const salt = await bcrypt.genSalt(10);
    const farmerPassword = await bcrypt.hash('farmer123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const farmerUser = await User.create({
      name: 'Rajesh Kumar Patel',
      email: 'farmer@agritech.com',
      password: farmerPassword,
      role: 'farmer',
      phone: '+91 98765 43210',
      location: 'Ludhiana, Punjab',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    });

    const adminUser = await User.create({
      name: 'Dr. Sunita Sharma',
      email: 'admin@agritech.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 98111 22334',
      location: 'New Delhi (AgriTech Directorate)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    });

    console.log('Seeding farms...');
    const farm1 = await Farm.create({
      user: farmerUser._id,
      farmName: 'Green Valley Agro Farm',
      location: 'Samrala Block, Ludhiana, Punjab',
      totalArea: 7.5,
      areaUnit: 'Acres',
      soilType: 'Alluvial Soil',
      irrigationType: 'Drip Irrigation',
      status: 'Active',
      notes: 'Certified zero-tillage field plot with integrated solar drip irrigation.',
    });

    const farm2 = await Farm.create({
      user: farmerUser._id,
      farmName: 'Surya Organic Orchards',
      location: 'Khanna Tehsil, Ludhiana, Punjab',
      totalArea: 4.2,
      areaUnit: 'Acres',
      soilType: 'Sandy Loam',
      irrigationType: 'Sprinkler System',
      status: 'Active',
      notes: 'Dedicated organic vegetable and pulse cultivation plot.',
    });

    console.log('Seeding crops with soil telemetry...');
    const crop1 = await Crop.create({
      user: farmerUser._id,
      farm: farm1._id,
      cropName: 'Wheat (Sharbati Golden)',
      cropCategory: 'Cereal',
      variety: 'HD-3086 (Pusa Gautami)',
      areaPlanted: 4.5,
      plantingDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      stage: 'Vegetative',
      healthStatus: 'Optimal',
      soilHealth: {
        nitrogen: 340,
        phosphorus: 28,
        potassium: 220,
        soilPh: 6.8,
        moisturePercentage: 68,
        organicCarbon: 0.88,
      },
      pestThreatLevel: 'Low',
      advisoryNotes: 'Vigorous tillering observed. Apply second dose of organic compost at crown root initiation.',
    });

    const crop2 = await Crop.create({
      user: farmerUser._id,
      farm: farm1._id,
      cropName: 'Basmati Paddy',
      cropCategory: 'Cereal',
      variety: 'Pusa 1121 Premium',
      areaPlanted: 3.0,
      plantingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000),
      stage: 'Germination',
      healthStatus: 'Needs Attention',
      soilHealth: {
        nitrogen: 240, // Low
        phosphorus: 18, // Slightly deficient
        potassium: 190,
        soilPh: 7.4,
        moisturePercentage: 82,
        organicCarbon: 0.65,
      },
      pestThreatLevel: 'Moderate',
      advisoryNotes: 'Nitrogen levels lower than target. Recommended top dressing of neem-coated urea or enriched vermicompost.',
    });

    const crop3 = await Crop.create({
      user: farmerUser._id,
      farm: farm2._id,
      cropName: 'Yellow Mustard',
      cropCategory: 'Oilseed',
      variety: 'Pusa Bold',
      areaPlanted: 2.2,
      plantingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      stage: 'Flowering',
      healthStatus: 'Good',
      soilHealth: {
        nitrogen: 310,
        phosphorus: 26,
        potassium: 240,
        soilPh: 6.9,
        moisturePercentage: 62,
        organicCarbon: 0.82,
      },
      pestThreatLevel: 'Low',
      advisoryNotes: 'Abundant golden blooms. Maintain bee hive boxes in proximity for enhanced cross-pollination.',
    });

    console.log('Seeding agro-weather & pest alerts...');
    await WeatherAlert.create({
      region: 'North Agricultural Belt (Punjab, Haryana, West UP)',
      temperature: 28,
      humidity: 62,
      rainfallProbability: 35,
      windSpeed: 14,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Mon', tempMin: 21, tempMax: 31, condition: 'Sunny', rainChance: 10 },
        { day: 'Tue', tempMin: 22, tempMax: 32, condition: 'Partly Cloudy', rainChance: 20 },
        { day: 'Wed', tempMin: 20, tempMax: 29, condition: 'Rainy', rainChance: 65 },
        { day: 'Thu', tempMin: 19, tempMax: 27, condition: 'Thunderstorm', rainChance: 80 },
        { day: 'Fri', tempMin: 21, tempMax: 30, condition: 'Sunny', rainChance: 15 },
      ],
      pestAlerts: [
        {
          pestName: 'Fall Armyworm (Spodoptera frugiperda)',
          severity: 'Severe',
          affectedCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
          symptoms: 'Pin-hole feeding marks on whorls and heavy fecal frass inside foliage.',
          preventativeMeasures: 'Install 5 pheromone traps/acre. Spray bio-pesticide Bacillus thuringiensis (Bt) @ 2g/L water during dusk.',
          active: true,
        },
        {
          pestName: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
          severity: 'Moderate',
          affectedCrops: ['Wheat', 'Barley'],
          symptoms: 'Yellow stripe-like pustules arranged along leaf veins in cool humid weather.',
          preventativeMeasures: 'Apply Propiconazole 25% EC @ 1ml/L of water upon first sight of infection stripe.',
          active: true,
        },
        {
          pestName: 'Brown Planthopper (BPH)',
          severity: 'Low',
          affectedCrops: ['Rice (Paddy)'],
          symptoms: 'Circular hopperburn patches with wilting and drying of plants.',
          preventativeMeasures: 'Alternate wetting and drying (AWD) irrigation; avoid excessive nitrogen doses.',
          active: true,
        },
      ],
    });

    console.log('Seeding marketplace products...');
    const products = await Product.create([
      {
        name: 'Certified HD-3086 Sharbati Wheat Seeds',
        category: 'Seeds',
        price: 1350,
        originalPrice: 1600,
        stock: 120,
        unit: '40 kg Bag',
        brand: 'National Seeds Corp',
        description: 'Government certified high-yielding wheat seeds with high protein content and disease resistance.',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80',
        rating: 4.8,
        numReviews: 42,
        suitableFor: ['Wheat'],
        inStock: true,
      },
      {
        name: 'Organic Neem Oil Bio-Pesticide (10,000 PPM)',
        category: 'Pesticides & Bio-agents',
        price: 490,
        originalPrice: 650,
        stock: 85,
        unit: '1 Liter Bottle',
        brand: 'BioShield Organics',
        description: 'Pure cold-pressed emulsifiable concentrate. Effective against aphids, armyworms, whiteflies and thrips.',
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
        rating: 4.7,
        numReviews: 29,
        suitableFor: ['Cotton', 'Vegetables', 'Paddy', 'Mustard'],
        inStock: true,
      },
      {
        name: 'Neem Coated Urea (Slow Release)',
        category: 'Fertilizers',
        price: 295,
        originalPrice: 350,
        stock: 200,
        unit: '45 kg Bag',
        brand: 'KRIBHCO Fertilizer',
        description: '46% Nitrogen content enriched with pure neem extracts for sustained nutrient release and nematode control.',
        imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=500&q=80',
        rating: 4.9,
        numReviews: 88,
        suitableFor: ['All Crops'],
        inStock: true,
      },
      {
        name: 'Digital 4-in-1 Soil pH, Moisture & Sunlight Sensor',
        category: 'Machinery & Tools',
        price: 1450,
        originalPrice: 1999,
        stock: 40,
        unit: 'Per Piece',
        brand: 'AgriSense Tech',
        description: 'Instant readout digital tester for accurate field monitoring of soil pH, moisture percentage, and ambient temp.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
        rating: 4.6,
        numReviews: 19,
        suitableFor: ['Farm Diagnostics'],
        inStock: true,
      },
      {
        name: 'Precision Drip Irrigation Kit (1 Acre Complete Set)',
        category: 'Irrigation Equipment',
        price: 6800,
        originalPrice: 8500,
        stock: 25,
        unit: 'Full 1 Acre Kit',
        brand: 'Jain Agro Irrigation',
        description: 'Complete drip setup including mainline lateral pipes, pressure-compensating drippers, filter, and flush valves.',
        imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=500&q=80',
        rating: 4.9,
        numReviews: 31,
        suitableFor: ['Orchards', 'Vegetables', 'Cotton'],
        inStock: true,
      },
      {
        name: 'Trichoderma Viride Bio-Fungicide (1% WP)',
        category: 'Pesticides & Bio-agents',
        price: 280,
        originalPrice: 380,
        stock: 90,
        unit: '1 kg Pack',
        brand: 'Krishi Vigyan Bio',
        description: 'Beneficial antagonist fungus controlling root rot, collar rot, damping off, and seed-borne wilt diseases.',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=500&q=80',
        rating: 4.7,
        numReviews: 14,
        suitableFor: ['Pulses', 'Oilseeds', 'Paddy'],
        inStock: true,
      },
    ]);

    console.log('Seeding sample completed order with tracking timeline...');
    await Order.create({
      user: farmerUser._id,
      orderItems: [
        {
          product: products[0]._id,
          name: products[0].name,
          quantity: 2,
          price: products[0].price,
          unit: products[0].unit,
          imageUrl: products[0].imageUrl,
        },
        {
          product: products[1]._id,
          name: products[1].name,
          quantity: 1,
          price: products[1].price,
          unit: products[1].unit,
          imageUrl: products[1].imageUrl,
        },
      ],
      shippingAddress: {
        fullName: 'Rajesh Kumar Patel',
        phone: '+91 98765 43210',
        address: 'House #42, Main Road near Canal Bridge',
        villageOrCity: 'Samrala',
        district: 'Ludhiana',
        state: 'Punjab',
        pinCode: '141114',
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Completed',
      totalAmount: 3190,
      orderStatus: 'Dispatched',
      trackingTimeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          note: 'Order confirmed and verified via Kisan SMS gateway.',
        },
        {
          status: 'Confirmed & Packed',
          timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
          note: 'Supplies packed securely at Ludhiana Regional Agri-Hub.',
        },
        {
          status: 'Dispatched',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          note: 'Consignment out for delivery with AgriTech Rural Express van.',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    console.log('Seeding community forum questions & expert solutions...');
    await ForumThread.create({
      author: farmerUser._id,
      authorName: 'Rajesh Kumar Patel',
      authorRole: 'farmer',
      title: 'How to manage Yellow Rust effectively during intermittent winter showers?',
      content: 'I observed small yellow stripes on the upper leaves of my wheat crop (variety HD-3086). The temperature is hovering around 20°C with high morning humidity. What is the best immediate remedy to prevent spreading across adjacent fields?',
      category: 'Crop Disease & Pests',
      tags: ['Wheat', 'Yellow Rust', 'Fungicide', 'Winter Crop'],
      upvotes: 14,
      isAnswered: true,
      replies: [
        {
          author: adminUser._id,
          authorName: 'Dr. Sunita Sharma',
          authorRole: 'admin',
          content: 'Yellow Rust flourishes when temperatures are 10-22°C with free moisture. Immediately spray Propiconazole 25% EC (Tilt) @ 1 ml per liter of water (200 ml in 200 liters water per acre) using a knapsack sprayer. Ensure spray is directed uniformly over the canopy. Avoid applying nitrogenous fertilizer right now as high vegetative succulent tissue aggravates fungal spread.',
          isExpertVerified: true,
          createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
        },
      ],
    });

    await ForumThread.create({
      author: farmerUser._id,
      authorName: 'Harpreet Singh (Farmer Peer)',
      authorRole: 'farmer',
      title: 'Drip irrigation vs Sprinkler for sandy loam soil in pulse crops',
      content: 'We are planning to cultivate moong and chickpea next season on 5 acres of sandy loam soil. Would drip or sprinkler give better water efficiency and yield?',
      category: 'Irrigation & Water',
      tags: ['Irrigation', 'Pulses', 'Water Conservation'],
      upvotes: 8,
      isAnswered: false,
      replies: [],
    });

    console.log('\n=============================================');
    console.log('🎉 AgriTech Database Successfully Seeded!');
    console.log('=============================================');
    console.log('👨‍🌾 Farmer Demo Credentials:');
    console.log('   Email:    farmer@agritech.com');
    console.log('   Password: farmer123');
    console.log('---------------------------------------------');
    console.log('🛡️ Admin Demo Credentials:');
    console.log('   Email:    admin@agritech.com');
    console.log('   Password: admin123');
    console.log('=============================================\n');

    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase(true);
}
