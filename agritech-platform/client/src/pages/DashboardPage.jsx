import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import SoilHealthGauge from '../components/SoilHealthGauge';
import {
  Sprout,
  Layers,
  ShoppingBag,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmsRes, cropsRes, ordersRes, weatherRes] = await Promise.all([
          API.get('/farms').catch(() => ({ data: { data: [] } })),
          API.get('/crops').catch(() => ({ data: { data: [] } })),
          API.get('/orders/my-orders').catch(() => ({ data: { data: [] } })),
          API.get('/weather/pest-alerts').catch(() => ({ data: { data: [] } })),
        ]);

        setFarms(farmsRes.data?.data || []);
        setCrops(cropsRes.data?.data || []);
        setOrders(ordersRes.data?.data || []);
        setPestAlerts(weatherRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalAcreage = farms.reduce((acc, f) => acc + (f.totalArea || 0), 0);

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded-4 shadow-sm border mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="rounded-circle border border-2 border-success p-1"
            style={{ width: 64, height: 64, objectFit: 'cover' }}
          />
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold text-dark mb-0">{user?.name}</h4>
              <span className="badge bg-success-subtle text-success border border-success text-capitalize">
                {user?.role}
              </span>
            </div>
            <p className="text-muted small mb-0 d-flex align-items-center gap-1">
              <MapPin size={14} /> {user?.location || 'Punjab, India'} • {user?.phone || 'Verified Farmer'}
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to="/crops" className="btn btn-agri btn-sm fw-semibold d-flex align-items-center gap-1">
            <PlusCircle size={16} /> Monitor New Crop
          </Link>
          <Link to="/marketplace" className="btn btn-outline-agri btn-sm fw-semibold d-flex align-items-center gap-1">
            <ShoppingBag size={16} /> Agri Store
          </Link>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="agri-card p-3 border-0 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">Registered Farms</span>
                <h3 className="fw-bold text-dark mb-0 mt-1">{farms.length}</h3>
                <small className="text-success fw-semibold">{totalAcreage.toFixed(1)} Total Acres</small>
              </div>
              <div className="bg-success-subtle text-success p-3 rounded-circle">
                <Layers size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="agri-card p-3 border-0 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">Active Monitored Crops</span>
                <h3 className="fw-bold text-dark mb-0 mt-1">{crops.length}</h3>
                <small className="text-primary fw-semibold">Soil Telemetry Synced</small>
              </div>
              <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                <Sprout size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="agri-card p-3 border-0 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">Active Orders</span>
                <h3 className="fw-bold text-dark mb-0 mt-1">{orders.length}</h3>
                <small className="text-secondary fw-semibold">Supply Shipments</small>
              </div>
              <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                <ShoppingBag size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="agri-card p-3 border-0 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">Pest Radar Alerts</span>
                <h3 className="fw-bold text-danger mb-0 mt-1">{pestAlerts.length}</h3>
                <small className="text-danger fw-semibold">Action Required</small>
              </div>
              <div className="bg-danger-subtle text-danger p-3 rounded-circle">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Crops Telemetry + Weather Widget */}
      <div className="row g-4">
        {/* Left Column: Monitored Crops & Farms */}
        <div className="col-lg-8">
          {/* Active Crops Telemetry Card */}
          <div className="agri-card p-4 bg-white border-0 shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Crop Monitoring & Soil Status</h5>
                <small className="text-muted">Live telemetry metrics & physiological growth stages</small>
              </div>
              <Link to="/crops" className="btn btn-outline-agri btn-sm fw-semibold">
                View All Crops
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : crops.length === 0 ? (
              <div className="text-center py-5 border rounded-3 bg-light">
                <Sprout size={36} className="text-muted mb-2" />
                <p className="text-muted mb-2">No active crops monitored yet.</p>
                <Link to="/crops" className="btn btn-agri btn-sm">Add Your First Crop</Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {crops.slice(0, 2).map((crop) => (
                  <div key={crop._id} className="p-3 border rounded-3 bg-white">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-2 gap-2">
                      <div>
                        <span className="fw-bold text-dark fs-6 me-2">{crop.cropName}</span>
                        <span className="badge bg-secondary-subtle text-secondary small me-2">{crop.variety}</span>
                        <span className="badge bg-light text-dark border small">{crop.areaPlanted} Acres</span>
                      </div>
                      <div>
                        <span className="badge bg-success-subtle text-success me-2">{crop.stage} Stage</span>
                        <span className={`badge ${crop.healthStatus === 'Optimal' ? 'health-optimal' : crop.healthStatus === 'Needs Attention' ? 'health-attention' : 'health-good'}`}>
                          {crop.healthStatus}
                        </span>
                      </div>
                    </div>

                    <SoilHealthGauge soilHealth={crop.soilHealth} healthStatus={crop.healthStatus} />

                    <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center small">
                      <span className="text-muted fst-italic">💡 {crop.advisoryNotes}</span>
                      <Link to={`/crops`} className="text-agri-primary fw-bold text-decoration-none">
                        Advisory Detail →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Farms Overview Card */}
          <div className="agri-card p-4 bg-white border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Your Registered Farms</h5>
                <small className="text-muted">Land parcels, soil categories, and irrigation modes</small>
              </div>
              <Link to="/farms" className="btn btn-outline-agri btn-sm fw-semibold">
                Manage Farms
              </Link>
            </div>

            <div className="row g-3">
              {farms.slice(0, 2).map((farm) => (
                <div key={farm._id} className="col-md-6">
                  <div className="p-3 border rounded-3 bg-light h-100">
                    <h6 className="fw-bold text-success mb-1">{farm.farmName}</h6>
                    <p className="text-muted small mb-2 d-flex align-items-center gap-1">
                      <MapPin size={13} /> {farm.location}
                    </p>
                    <div className="small mb-2">
                      <div><strong>Area:</strong> {farm.totalArea} {farm.areaUnit}</div>
                      <div><strong>Soil:</strong> {farm.soilType}</div>
                      <div><strong>Irrigation:</strong> {farm.irrigationType}</div>
                    </div>
                    <span className="badge bg-success">{farm.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Weather & Active Pest Radar */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-4">
            <WeatherWidget />

            {/* Quick Pest Warnings Alert Box */}
            <div className="agri-card p-4 bg-white border-0 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-danger" />
                <h6 className="fw-bold text-dark mb-0">Regional Pest Alerts</h6>
              </div>

              {pestAlerts.length === 0 ? (
                <p className="text-muted small mb-0">No active severe pest threats in your zone.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {pestAlerts.slice(0, 2).map((alert, idx) => (
                    <div key={idx} className="p-3 border-start border-4 border-danger rounded bg-light small">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-danger">{alert.pestName}</strong>
                        <span className="badge bg-danger">{alert.severity}</span>
                      </div>
                      <p className="text-muted mb-1">
                        <strong>Target Crops:</strong> {alert.affectedCrops?.join(', ')}
                      </p>
                      <p className="mb-0 text-dark">
                        <strong>Remedy:</strong> {alert.preventativeMeasures}
                      </p>
                    </div>
                  ))}
                  <Link to="/weather" className="btn btn-outline-danger btn-sm w-100 fw-bold mt-2">
                    Open Comprehensive Radar
                  </Link>
                </div>
              )}
            </div>

            {/* Community Help Callout */}
            <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 text-center">
              <Sprout size={28} className="text-success mb-2" />
              <h6 className="fw-bold text-success">Have a Crop Problem?</h6>
              <p className="small text-muted mb-3">
                Post pictures of affected foliage or describe symptoms on our Expert Consultation Forum.
              </p>
              <Link to="/forum" className="btn btn-agri btn-sm w-100 fw-bold">
                Consult Agricultural Experts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
