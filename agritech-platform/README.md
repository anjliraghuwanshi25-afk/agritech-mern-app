# 🌾 AgriTech - Empowering Farmers Through Digital Technology
> **A Comprehensive Full-Stack MERN Agricultural Ecosystem & Farm Management Platform**  
> *Developed for College Project / Final Year Capstone Presentation*

---

## 📌 Project Overview
**AgriTech** is an integrated full-stack web application built to modernize farming practices and bridge the technological gap for rural cultivators. It combines real-time agronomic telemetry, AI/rule-based soil diagnostic advisories, 5-day agro-meteorological forecasting, active pest threat alerts, a direct agricultural resource marketplace, and an expert consultation forum.

---

## 🏗️ Architecture & Technology Stack

```
agritech-platform/
│
├── client/                      # React 18 SPA (Vite + Bootstrap 5 + Lucide Icons)
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Footer, SoilHealthGauge, WeatherWidget, ProtectedRoute)
│   │   ├── context/             # Global Contexts (AuthContext, CartContext)
│   │   ├── pages/               # 11 Dedicated Pages (Dashboard, Crops, Farms, Store, Orders, Forum, Admin...)
│   │   └── services/            # Axios API client with JWT interceptors
│
├── server/                      # Node.js & Express.js REST API
│   ├── config/                  # MongoDB Mongoose connection
│   ├── controllers/             # 8 Specialized Controllers (Auth, Farm, Crop, Weather, Product, Order, Forum, Admin)
│   ├── data/                    # Automated Database Seeder (seed.js)
│   ├── middleware/              # JWT verification & Role guards (protect, adminOnly)
│   ├── models/                  # 7 Mongoose Schemas (User, Farm, Crop, Product, Order, WeatherAlert, ForumThread)
│   └── routes/                  # Modular RESTful Route Definitions
```

### Tech Stack Details:
- **Frontend**: React 18, React Router v6, Bootstrap 5, Bootstrap Icons, Lucide-React, Axios.
- **Backend**: Node.js, Express.js (REST API, CORS, JSON Body Parsing).
- **Database**: MongoDB with Mongoose ODM.
- **Security & Auth**: JWT (JSON Web Tokens) with `bcryptjs` password hashing and Role-Based Access Control (`farmer` vs `admin`).
- **Dev Tooling**: Concurrently (run server and client with a single command).

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: (v18.0.0 or higher recommended)
- **MongoDB**: Local MongoDB instance (`mongod`) or a cloud MongoDB Atlas URI.

### 2. Setup Database Connection
Open `server/.env` and verify your MongoDB connection string:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agritech
JWT_SECRET=agritech_jwt_secret_key_2026_secure
JWT_EXPIRES_IN=7d
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/agritech`)*

### 3. Install Dependencies
Open PowerShell or your preferred terminal in the project directory:

```bash
# Option A: One-line install from root
cd agritech-platform
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 4. Seed Database (Realistic Pre-Populated Data)
Run the automated seeder to load test farmers, admin profiles, monitored crops with soil telemetry, agro-weather forecasts, store products, and discussion threads:

```bash
cd server
npm run seed
cd ..
```

### 5. Launch Full-Stack Application
Run both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) simultaneously:

```bash
# From agritech-platform root:
npm run dev
```

*Or run individually in two separate terminal windows:*
- Terminal 1 (Backend): `cd server && npm run dev`
- Terminal 2 (Frontend): `cd client && npm run dev`

Open your browser at: **`http://localhost:3000`**

---

## 🔑 Demo Credentials (For Evaluation & Viva)

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **👨‍🌾 Farmer** | `farmer@agritech.com` | `farmer123` | Farm profiles, crop telemetry, order placement & tracking, asking forum questions |
| **🛡️ Admin** | `admin@agritech.com` | `admin123` | Full control center, user directory, inventory manager, order fulfillment station, pest alert broadcast |

> 💡 **Tip:** The Login and Home pages feature **One-Click Demo Login Buttons** that automatically log you in without typing credentials.

---

## 📋 Modules & Features Walkthrough

### 1. User Registration & Role-Based Authentication
- Secure registration with role toggle (`Farmer` / `Agricultural Officer`).
- Password encryption using salted bcrypt hashes.
- JWT token persistence across browser sessions.

### 2. Farm Profile Setup & Land Management (`/farms`)
- Add and manage multiple acreage land parcels.
- Configurable soil types (Alluvial, Black Regur, Red & Yellow, Sandy Loam, Clay, Laterite).
- Irrigation infrastructure categorization (Drip Irrigation, Sprinkler, Canal, Tube Well, Rainfed).

### 3. Crop Monitoring & Soil Health Analysis (`/crops`)
- 7-Stage growth cycle tracker (*Sowing ➔ Germination ➔ Vegetative ➔ Flowering ➔ Yield Formation ➔ Ripening ➔ Harvested*).
- Soil telemetry meters for Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, and Moisture Percentage.
- **Smart AI Agronomic Diagnostic Button**: Evaluates soil NPK and gives customized remediation advice (e.g., urea split dosing, agricultural limestone for acidic soil, drainage warnings).

### 4. Agro-Meteorology & Pest Threat Radar (`/weather`)
- Live atmospheric widgets: Temperature, Relative Humidity, Wind Velocity, and Rain Probability.
- 5-Day agro-weather forecast outlook.
- **Pest Threat Radar**: Real-time warnings (Fall Armyworm, Yellow Rust, Stem Borer) with severity badges, diagnostic leaf symptoms, and preventative organic/chemical recommendations.
- **Admin Emergency Broadcast Center**: Allows agricultural officers to broadcast outbreak advisories immediately.

### 5. Agricultural Resource Marketplace (`/marketplace`)
- E-Commerce catalogue categorized by: *Seeds, Fertilizers, Pesticides & Bio-agents, Machinery & Tools, Irrigation Equipment*.
- Search bar, category filters, and price sorting.
- Product modal with crop suitability tags, stock counters, and reviews.

### 6. Order Fulfillment & Live Consignment Tracking (`/orders`)
- Shopping cart with quantity controls and instant subtotal recalculation.
- Shipping address form with payment method simulation (COD, UPI / NetBanking, Kisan Credit Card).
- **Interactive Visual Stepper**: Tracks consignment progression (*Order Placed ➔ Confirmed & Packed ➔ Dispatched ➔ Out for Delivery ➔ Delivered*) with timestamped logs.

### 7. Expert Consultation & Community Forums (`/forum`)
- Question posting with crop category tags and search.
- Upvote counter for community discussions.
- **Expert Verified Badges**: Highlights solutions posted by certified agronomists or administrators in golden highlight cards.

### 8. Admin Command Center (`/admin`)
- Aggregated KPI cards: Total Farmers, Monitored Farms, Total Crops, Sales Revenue, Active Alerts.
- **Farmer Directory**: Table with user details and role switching capabilities.
- **Store Inventory Manager**: Form to publish new products, adjust pricing, and delete obsolete listings.
- **Order Fulfillment Station**: Dropdown selector to advance customer order stages in real time.

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new farmer or admin account |
| `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT token |
| `/api/auth/me` | `GET` | Private | Retrieve current user profile |
| `/api/farms` | `GET` / `POST` | Private | Get user farms / Register new farm profile |
| `/api/farms/:id` | `GET` / `PUT` / `DELETE`| Private | Manage individual farm and associated crops |
| `/api/crops` | `GET` / `POST` | Private | Get monitored crops / Register new crop |
| `/api/crops/:id/advisory`| `GET` | Private | Smart soil health diagnostic report |
| `/api/weather` | `GET` | Public | Fetch real-time weather & 5-day forecast |
| `/api/weather/pest-alerts` | `GET` | Public | List active regional pest outbreak alerts |
| `/api/weather/pest-alerts` | `POST` | Admin | Broadcast new emergency pest warning |
| `/api/products` | `GET` | Public | Browse agricultural supplies catalogue |
| `/api/products` | `POST` / `PUT` / `DELETE`| Admin | Inventory catalogue management |
| `/api/orders` | `POST` | Private | Place resource supply order |
| `/api/orders/my-orders` | `GET` | Private | Get logged-in farmer's order history |
| `/api/orders/:id/status`| `PUT` | Admin | Advance order shipment status |
| `/api/forum` | `GET` / `POST` | Public / Private | Browse threads / Post question |
| `/api/forum/:id/reply` | `POST` | Private | Post farmer reply or verified expert advice |
| `/api/admin/metrics` | `GET` | Admin | Aggregated analytics & platform KPIs |
| `/api/admin/users` | `GET` | Admin | Farmer directory & role management |

---

## 🎓 College Viva / Project Presentation Q&A Guide

**Q1: Why did you choose the MERN stack for AgriTech?**  
*Answer:* MERN enables end-to-end JavaScript/JSON consistency. MongoDB provides dynamic schema flexibility required for varying soil chemical parameters and crop stages. Express & Node provide asynchronous high-concurrency event loops suited for live telemetry and order tracking. React offers a reactive single-page interface with reusable modular components.

**Q2: How is security handled for farmers and administrators?**  
*Answer:* User passwords are protected using bcrypt salt-hashing before persisting to MongoDB. Protected REST endpoints require an `Authorization: Bearer <token>` header containing a digitally signed JSON Web Token (JWT). Role-based middleware (`adminOnly`) enforces strict permission segregation.

**Q3: How does the Crop Soil Diagnostic algorithm work?**  
*Answer:* The backend controller evaluates Nitrogen, Phosphorus, Potassium (NPK), pH, and moisture levels against agronomical reference benchmarks. It programmatically flags deficiencies or excesses (e.g. Nitrogen < 280 kg/ha or pH < 6.0) and generates contextual remedial actions (such as Neem-coated urea or agricultural lime application).

---
*Built with ❤️ for Agricultural Innovation & Academic Excellence.*
