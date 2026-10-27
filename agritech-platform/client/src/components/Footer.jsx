import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-success">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-success text-white rounded p-1">
                <Sprout size={24} />
              </div>
              <h5 className="mb-0 fw-bold text-success">AgriTech</h5>
            </div>
            <p className="text-secondary small">
              "Empowering farmers through digital technology" — An integrated full-stack MERN agricultural platform bridging scientific crop telemetries, real-time agro-weather alerts, community wisdom, and rural market logistics.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-success-subtle text-success border border-success">React 18</span>
              <span className="badge bg-success-subtle text-success border border-success">Node & Express</span>
              <span className="badge bg-success-subtle text-success border border-success">MongoDB</span>
              <span className="badge bg-success-subtle text-success border border-success">JWT Auth</span>
            </div>
          </div>

          {/* Direct Modules */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Key Modules</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/farms" className="text-decoration-none text-secondary hover-white">Farm Management</Link></li>
              <li><Link to="/crops" className="text-decoration-none text-secondary hover-white">Crop & Soil Health</Link></li>
              <li><Link to="/weather" className="text-decoration-none text-secondary hover-white">Weather & Pest Radar</Link></li>
              <li><Link to="/marketplace" className="text-decoration-none text-secondary hover-white">Agri Resource Store</Link></li>
              <li><Link to="/forum" className="text-decoration-none text-secondary hover-white">Community & Consultation</Link></li>
            </ul>
          </div>

          {/* National Farmer Support & Helplines */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Emergency & Advisory</h6>
            <div className="p-3 rounded bg-secondary bg-opacity-10 border border-secondary border-opacity-25 mb-2">
              <div className="d-flex align-items-center gap-2 text-warning mb-1 fw-semibold small">
                <PhoneCall size={16} />
                <span>Kisan Call Center (Toll Free)</span>
              </div>
              <p className="mb-0 text-white fw-bold fs-5">1800-180-1551</p>
              <small className="text-secondary">24x7 Agro advisory in 22 regional languages</small>
            </div>
          </div>

          {/* College Project Viva Credits */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Project Metadata</h6>
            <div className="small text-secondary">
              <p className="mb-1"><strong>Category:</strong> Final Year Capstone</p>
              <p className="mb-1"><strong>Domain:</strong> Agri-Informatics & Cloud Computing</p>
              <p className="mb-2"><strong>Architecture:</strong> RESTful Monorepo</p>
              <div className="p-2 bg-success bg-opacity-10 text-success rounded border border-success border-opacity-25 small">
                <ShieldAlert size={14} className="me-1 d-inline" />
                Dual Role: Farmer & Admin enabled
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary">
          <p className="mb-0">© {new Date().getFullYear()} AgriTech Platform. Built for Agricultural Innovation.</p>
          <p className="mb-0 mt-2 mt-sm-0">
            Crafted with <Heart size={14} className="text-danger d-inline" /> for Indian & Global Farmers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
