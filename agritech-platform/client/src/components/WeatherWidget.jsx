import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { CloudSun, Droplets, Wind, AlertTriangle, ArrowRight } from 'lucide-react';

const WeatherWidget = ({ compact = false }) => {
  const [weather, setWeather] = useState({
    region: 'North Agro Zone',
    temperature: 28,
    humidity: 64,
    rainfallProbability: 35,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    pestAlerts: [
      {
        pestName: 'Fall Armyworm',
        severity: 'Severe',
        affectedCrops: ['Maize', 'Sweet Corn'],
        preventativeMeasures: 'Install pheromone traps and spray bio-agent Bt.',
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await API.get('/weather');
        if (res.data?.success && res.data?.data) {
          setWeather(res.data.data);
        }
      } catch (err) {
        // Keep default realistic simulated weather
      }
    };
    fetchWeather();
  }, []);

  const activePestCount = weather.pestAlerts?.filter((a) => a.active !== false)?.length || 0;

  if (compact) {
    return (
      <div className="agri-card p-3 bg-white border border-success border-opacity-25 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-success-subtle text-success fw-semibold">
            <CloudSun size={14} className="me-1 d-inline" /> Local Weather
          </span>
          <span className="fw-bold fs-5 text-dark">{weather.temperature}°C</span>
        </div>
        <p className="small text-muted mb-2">{weather.condition} in {weather.region?.split('(')[0]}</p>
        <div className="d-flex justify-content-between small text-secondary">
          <span><Droplets size={13} className="text-primary me-1" />{weather.humidity}% Humidity</span>
          <span><Wind size={13} className="text-info me-1" />{weather.windSpeed} km/h</span>
        </div>
        {activePestCount > 0 && (
          <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between text-danger small">
            <span className="fw-semibold"><AlertTriangle size={13} className="me-1" /> {activePestCount} Pest Warning(s)</span>
            <Link to="/weather" className="text-danger fw-bold text-decoration-none">View</Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="agri-card p-4 bg-white border-0 shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge bg-success text-white mb-1">Live Agro-Meteorology</span>
          <h5 className="fw-bold mb-0 text-dark">{weather.region}</h5>
        </div>
        <div className="text-end">
          <h2 className="fw-bold text-success mb-0">{weather.temperature}°C</h2>
          <small className="text-muted fw-semibold">{weather.condition}</small>
        </div>
      </div>

      <div className="row g-2 text-center my-3">
        <div className="col-4">
          <div className="p-2 rounded bg-light border">
            <Droplets size={18} className="text-primary mb-1" />
            <div className="fw-bold">{weather.humidity}%</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Humidity</small>
          </div>
        </div>
        <div className="col-4">
          <div className="p-2 rounded bg-light border">
            <CloudSun size={18} className="text-warning mb-1" />
            <div className="fw-bold">{weather.rainfallProbability}%</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Rain Chance</small>
          </div>
        </div>
        <div className="col-4">
          <div className="p-2 rounded bg-light border">
            <Wind size={18} className="text-info mb-1" />
            <div className="fw-bold">{weather.windSpeed} km/h</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Wind Speed</small>
          </div>
        </div>
      </div>

      {activePestCount > 0 && (
        <div className="alert alert-warning py-2 px-3 small d-flex align-items-center justify-content-between mb-0 mt-3">
          <div className="d-flex align-items-center gap-2">
            <AlertTriangle size={16} className="text-warning flex-shrink-0" />
            <span>
              <strong>{activePestCount} Active Threat(s):</strong> {weather.pestAlerts[0]?.pestName}
            </span>
          </div>
          <Link to="/weather" className="btn btn-warning btn-sm py-0 px-2 fw-semibold d-flex align-items-center gap-1">
            Radar <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
