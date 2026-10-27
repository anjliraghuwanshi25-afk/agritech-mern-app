import React from 'react';
import { Activity, Droplet, Sparkles } from 'lucide-react';

const SoilHealthGauge = ({ soilHealth = {}, healthStatus = 'Good' }) => {
  const {
    nitrogen = 320,
    phosphorus = 24,
    potassium = 210,
    soilPh = 6.8,
    moisturePercentage = 65,
    organicCarbon = 0.85,
  } = soilHealth;

  // Calculate percentage gauges against reference optimal scales
  const nPercent = Math.min(Math.round((nitrogen / 500) * 100), 100);
  const pPercent = Math.min(Math.round((phosphorus / 40) * 100), 100);
  const kPercent = Math.min(Math.round((potassium / 300) * 100), 100);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Optimal':
        return <span className="badge health-optimal px-3 py-1 fw-bold">Optimal Condition</span>;
      case 'Needs Attention':
        return <span className="badge health-attention px-3 py-1 fw-bold">Needs Attention</span>;
      case 'Critical':
        return <span className="badge health-critical px-3 py-1 fw-bold">Critical Alert</span>;
      default:
        return <span className="badge health-good px-3 py-1 fw-bold">Good Condition</span>;
    }
  };

  return (
    <div className="bg-light p-3 rounded-3 border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold small text-dark d-flex align-items-center gap-1">
          <Activity size={16} className="text-success" /> Soil Chemistry & Telemetry
        </span>
        {getStatusBadge(healthStatus)}
      </div>

      {/* Primary N-P-K Levels */}
      <div className="mb-2">
        <div className="d-flex justify-content-between small mb-1">
          <span className="fw-semibold text-secondary">Nitrogen (N)</span>
          <span className="fw-bold text-dark">{nitrogen} kg/ha</span>
        </div>
        <div className="progress" style={{ height: 7 }}>
          <div
            className={`progress-bar ${nitrogen < 280 ? 'bg-warning' : 'bg-success'}`}
            role="progressbar"
            style={{ width: `${nPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-2">
        <div className="d-flex justify-content-between small mb-1">
          <span className="fw-semibold text-secondary">Phosphorus (P)</span>
          <span className="fw-bold text-dark">{phosphorus} kg/ha</span>
        </div>
        <div className="progress" style={{ height: 7 }}>
          <div
            className={`progress-bar ${phosphorus < 20 ? 'bg-danger' : 'bg-primary'}`}
            role="progressbar"
            style={{ width: `${pPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between small mb-1">
          <span className="fw-semibold text-secondary">Potassium (K)</span>
          <span className="fw-bold text-dark">{potassium} kg/ha</span>
        </div>
        <div className="progress" style={{ height: 7 }}>
          <div
            className={`progress-bar ${potassium < 150 ? 'bg-warning' : 'bg-info'}`}
            role="progressbar"
            style={{ width: `${kPercent}%` }}
          ></div>
        </div>
      </div>

      {/* pH, Moisture, Organic Carbon Pills */}
      <div className="row g-2 text-center pt-2 border-top">
        <div className="col-4">
          <div className="bg-white p-2 rounded border small">
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Soil pH</small>
            <span className="fw-bold text-dark">{soilPh}</span>
            <small className={`d-block ${soilPh >= 6.0 && soilPh <= 7.5 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.65rem' }}>
              {soilPh >= 6.0 && soilPh <= 7.5 ? 'Neutral' : 'Check'}
            </small>
          </div>
        </div>
        <div className="col-4">
          <div className="bg-white p-2 rounded border small">
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Moisture</small>
            <span className="fw-bold text-dark">{moisturePercentage}%</span>
            <small className="d-block text-primary" style={{ fontSize: '0.65rem' }}>
              {moisturePercentage < 40 ? 'Dry' : moisturePercentage > 80 ? 'Wet' : 'Adequate'}
            </small>
          </div>
        </div>
        <div className="col-4">
          <div className="bg-white p-2 rounded border small">
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Carbon</small>
            <span className="fw-bold text-dark">{organicCarbon}%</span>
            <small className="d-block text-success" style={{ fontSize: '0.65rem' }}>Organic</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthGauge;
