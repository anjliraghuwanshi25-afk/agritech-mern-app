import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  ShoppingCart,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user, loginAsDemoFarmer, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDemoFarmer = async () => {
    const res = await loginAsDemoFarmer();
    if (res?.success) navigate('/dashboard');
  };

  const handleDemoAdmin = async () => {
    const res = await loginAsDemoAdmin();
    if (res?.success) navigate('/admin');
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-gradient py-5 text-white">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-20 text-white mb-3 small fw-semibold">
                <Sparkles size={16} />
                <span>Smart Agriculture Platform • MERN Capstone</span>
              </div>
              <h1 className="display-4 fw-extrabold mb-3 lh-sm">
                AgriTech: Empowering Farmers Through Digital Technology
              </h1>
              <p className="lead opacity-90 mb-4">
                Bridge traditional farming with precision agriculture. Monitor soil nutrients (NPK & pH), track crop growth stages, access 5-day weather & pest forecasts, buy certified agri-resources, and consult certified agricultural experts.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-warning btn-lg fw-bold px-4 text-dark shadow-sm d-flex align-items-center gap-2">
                    Enter Farmer Dashboard <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-warning btn-lg fw-bold px-4 text-dark shadow-sm d-flex align-items-center gap-2">
                      Get Started Free <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg fw-semibold px-4">
                      Farmer Login
                    </Link>
                  </>
                )}
              </div>

              {/* Quick College Viva 1-Click Demo Shortcut Bar */}
              <div className="bg-black bg-opacity-30 p-3 rounded-3 border border-white border-opacity-20">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span className="small fw-semibold text-warning">
                    ⚡ Evaluator Quick Test (1-Click Demo Access):
                  </span>
                  <div className="d-flex gap-2">
                    <button onClick={handleDemoFarmer} className="btn btn-sm btn-light fw-bold">
                      Login as Farmer
                    </button>
                    <button onClick={handleDemoAdmin} className="btn btn-sm btn-warning fw-bold text-dark">
                      Login as Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Weather & Smart Telemetry Card */}
            <div className="col-lg-5">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge bg-success-subtle text-success px-3 py-1 mb-2 fw-semibold">
              Integrated Modules
            </span>
            <h2 className="fw-bold text-dark">Engineered for Agricultural Excellence</h2>
            <p className="text-muted">
              From field soil telemetry to harvest dispatch, every tool is calibrated for high productivity and crop health.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100 border">
                <div className="bg-success-subtle text-success p-3 rounded-circle d-inline-flex mb-3">
                  <Sprout size={28} />
                </div>
                <h5 className="fw-bold">Crop & Soil Health Telemetry</h5>
                <p className="text-muted small">
                  Track dynamic NPK (Nitrogen, Phosphorus, Potassium), soil pH, and moisture with AI-driven diagnostic fertilizer recommendations.
                </p>
                <Link to="/crops" className="text-agri-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                  Explore Diagnostics <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100 border">
                <div className="bg-info-subtle text-info p-3 rounded-circle d-inline-flex mb-3">
                  <CloudSun size={28} />
                </div>
                <h5 className="fw-bold">Agro-Weather & Pest Radar</h5>
                <p className="text-muted small">
                  5-day meteorological forecasts combined with active outbreak alerts for Fall Armyworm, Yellow Rust, and Planthoppers with preventative protocols.
                </p>
                <Link to="/weather" className="text-agri-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                  View Weather Radar <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100 border">
                <div className="bg-warning-subtle text-warning p-3 rounded-circle d-inline-flex mb-3">
                  <ShoppingCart size={28} />
                </div>
                <h5 className="fw-bold">Agri-Resource Marketplace</h5>
                <p className="text-muted small">
                  Purchase certified hybrid seeds, bio-pesticides, slow-release urea, and solar drip kits with real-time consignment order tracking.
                </p>
                <Link to="/marketplace" className="text-agri-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                  Browse Products <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100 border">
                <div className="bg-danger-subtle text-danger p-3 rounded-circle d-inline-flex mb-3">
                  <Users size={28} />
                </div>
                <h5 className="fw-bold">Expert Consultation & Forum</h5>
                <p className="text-muted small">
                  Ask questions, share localized field insights, and receive verified answers from registered agronomists and experienced farmer peers.
                </p>
                <Link to="/forum" className="text-agri-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                  Join Community <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100 border">
                <div className="bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex mb-3">
                  <TrendingUp size={28} />
                </div>
                <h5 className="fw-bold">Farm Profile & Land Registry</h5>
                <p className="text-muted small">
                  Manage multiple acreage plots, map soil categories (Alluvial, Black, Sandy Loam), and track irrigation infrastructure (Drip vs Sprinkler).
                </p>
                <Link to="/farms" className="text-agri-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                  Manage Farms <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-md-4">
              <div className="agri-card p-4 h-100 border">
                <div className="bg-secondary-subtle text-dark p-3 rounded-circle d-inline-flex mb-3">
                  <ShieldCheck size={28} />
                </div>
                <h5 className="fw-bold">Admin Command Center</h5>
                <p className="text-muted small">
                  Complete authority to broadcast emergency pest warnings, manage marketplace catalogue items, track order fulfillments, and inspect user profiles.
                </p>
                <Link to="/admin" className="text-agri-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                  Admin Overview <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Impact Stats */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-success display-6 mb-1">10,000+</h2>
              <p className="text-muted small mb-0">Acres Monitored</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-success display-6 mb-1">98.5%</h2>
              <p className="text-muted small mb-0">Pest Forecast Accuracy</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-success display-6 mb-1">2,400+</h2>
              <p className="text-muted small mb-0">Verified Farmers</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-success display-6 mb-1">24 hrs</h2>
              <p className="text-muted small mb-0">Expert Turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-5 bg-white text-center">
        <div className="container py-3">
          <div className="p-5 rounded-4 bg-agri-primary text-white shadow-sm">
            <h2 className="fw-bold mb-3">Empower Your Farm with Modern Technology Today</h2>
            <p className="lead opacity-90 mb-4 max-w-xl mx-auto">
              Join thousands of forward-thinking farmers who save water, optimize fertilizers, and maximize crop yields with AgriTech.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn btn-warning btn-lg fw-bold text-dark px-4">
                Register as Farmer
              </Link>
              <Link to="/marketplace" className="btn btn-outline-light btn-lg fw-semibold px-4">
                Visit Agri Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
