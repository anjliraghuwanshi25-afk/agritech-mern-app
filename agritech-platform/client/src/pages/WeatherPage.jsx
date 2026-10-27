import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  ShieldAlert,
  Send,
  Plus,
  Compass,
  Calendar,
  Thermometer,
} from 'lucide-react';

const WeatherPage = () => {
  const { isAdmin } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [submittingAlert, setSubmittingAlert] = useState(false);

  const [alertForm, setAlertForm] = useState({
    pestName: '',
    severity: 'Moderate',
    affectedCrops: 'Wheat, Rice',
    symptoms: '',
    preventativeMeasures: '',
  });

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await API.get('/weather');
      if (res.data?.success) {
        setWeatherData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load agro-weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    setSubmittingAlert(true);
    try {
      const res = await API.post('/weather/pest-alerts', {
        ...alertForm,
        affectedCrops: alertForm.affectedCrops.split(',').map((c) => c.trim()),
      });
      if (res.data?.success) {
        setShowBroadcastModal(false);
        fetchWeather();
        setAlertForm({
          pestName: '',
          severity: 'Moderate',
          affectedCrops: 'Wheat, Rice',
          symptoms: '',
          preventativeMeasures: '',
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error broadcasting alert');
    } finally {
      setSubmittingAlert(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <CloudSun className="text-warning" /> Agro-Meteorology & Pest Threat Radar
          </h3>
          <p className="text-muted small mb-0">
            Real-time weather parameters and early warning pest outbreak advisories.
          </p>
        </div>

        {isAdmin && (
          <button
            className="btn btn-warning text-dark fw-bold d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setShowBroadcastModal(true)}
          >
            <ShieldAlert size={18} /> Broadcast Pest Alert (Admin)
          </button>
        )}
      </div>

      {loading || !weatherData ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Main Weather Overview Card */}
          <div className="agri-card p-4 bg-white shadow-sm border mb-4">
            <div className="row align-items-center g-4">
              <div className="col-md-6">
                <span className="badge bg-success mb-2">Live Weather Station</span>
                <h4 className="fw-bold text-dark mb-1">{weatherData.region}</h4>
                <p className="text-muted small mb-3">
                  Atmospheric readings calibrated for regional crop development
                </p>

                <div className="d-flex align-items-baseline gap-3">
                  <h1 className="display-3 fw-bold text-success mb-0">{weatherData.temperature}°C</h1>
                  <div>
                    <h5 className="mb-0 fw-semibold text-dark">{weatherData.condition}</h5>
                    <small className="text-muted">High solar radiation</small>
                  </div>
                </div>
              </div>

              {/* Atmospheric Metric Pills */}
              <div className="col-md-6">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <Droplets size={24} className="text-primary mb-1" />
                      <h4 className="fw-bold text-dark mb-0">{weatherData.humidity}%</h4>
                      <small className="text-muted">Relative Humidity</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <CloudSun size={24} className="text-warning mb-1" />
                      <h4 className="fw-bold text-dark mb-0">{weatherData.rainfallProbability}%</h4>
                      <small className="text-muted">Rainfall Probability</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <Wind size={24} className="text-info mb-1" />
                      <h4 className="fw-bold text-dark mb-0">{weatherData.windSpeed} km/h</h4>
                      <small className="text-muted">Wind Velocity</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <Compass size={24} className="text-secondary mb-1" />
                      <h4 className="fw-bold text-dark mb-0">NW</h4>
                      <small className="text-muted">Wind Direction</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Agro Forecast */}
            <hr className="my-4" />
            <h6 className="fw-bold text-dark mb-3">5-Day Agricultural Forecast Outlook:</h6>
            <div className="row g-2">
              {weatherData.forecast?.map((day, idx) => (
                <div key={idx} className="col">
                  <div className="p-2 rounded-3 bg-light text-center border h-100">
                    <div className="fw-bold text-dark small">{day.day}</div>
                    <div className="my-1">
                      <small className="badge bg-white border text-dark">{day.condition}</small>
                    </div>
                    <div className="small fw-semibold text-success">
                      {day.tempMin}° - {day.tempMax}°C
                    </div>
                    <small className="text-primary" style={{ fontSize: '0.7rem' }}>
                      💧 {day.rainChance}% rain
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pest Threat Radar Section */}
          <div className="agri-card p-4 bg-white shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <AlertTriangle className="text-danger" /> Active Pest Threat Radar & Advisories
                </h5>
                <p className="text-muted small mb-0">
                  Targeted mitigation measures issued by State Agricultural Universities and ICAR.
                </p>
              </div>
              <span className="badge bg-danger fs-6 px-3 py-2">
                {weatherData.pestAlerts?.length || 0} Outbreaks Monitored
              </span>
            </div>

            <div className="row g-4">
              {weatherData.pestAlerts?.map((alert, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className={`p-4 rounded-3 border h-100 d-flex flex-column justify-content-between ${alert.severity === 'Severe' ? 'border-danger bg-danger-subtle bg-opacity-25' : 'bg-light'}`}>
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge ${alert.severity === 'Severe' ? 'bg-danger' : alert.severity === 'Moderate' ? 'bg-warning text-dark' : 'bg-info'}`}>
                          {alert.severity} Risk
                        </span>
                        <small className="text-muted">
                          {alert.broadcastDate ? new Date(alert.broadcastDate).toLocaleDateString() : 'Active'}
                        </small>
                      </div>

                      <h5 className="fw-bold text-dark mb-1">{alert.pestName}</h5>

                      <div className="mb-2">
                        <span className="small text-secondary fw-semibold">Affected Crops: </span>
                        {alert.affectedCrops?.map((crop, cIdx) => (
                          <span key={cIdx} className="badge bg-white border text-dark me-1 small">
                            {crop}
                          </span>
                        ))}
                      </div>

                      {alert.symptoms && (
                        <div className="small text-muted mb-2">
                          <strong>Diagnostic Symptoms:</strong> {alert.symptoms}
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-2 bg-white border mt-3 small">
                      <strong className="text-success d-block mb-1">Preventative Action Plan:</strong>
                      <p className="mb-0 text-dark">{alert.preventativeMeasures}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Admin Broadcast Pest Warning Modal */}
      {showBroadcastModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <ShieldAlert size={20} /> Broadcast Emergency Pest Advisory to All Farmers
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowBroadcastModal(false)}
                ></button>
              </div>

              <form onSubmit={handleBroadcastAlert}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Pest / Disease Scientific or Common Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Fall Armyworm or Yellow Stem Borer"
                        value={alertForm.pestName}
                        onChange={(e) => setAlertForm({ ...alertForm, pestName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Threat Severity Level *</label>
                      <select
                        className="form-select"
                        value={alertForm.severity}
                        onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                      >
                        <option value="Severe">Severe (Outbreak Danger)</option>
                        <option value="Moderate">Moderate (Watch & Treat)</option>
                        <option value="Low">Low (Preventative Alert)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Vulnerable Crops (comma separated) *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat, Barley, Mustard, Maize"
                        value={alertForm.affectedCrops}
                        onChange={(e) => setAlertForm({ ...alertForm, affectedCrops: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Visual Symptoms</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        placeholder="Describe leaf spots, whorl damage, wilting, or frass markings..."
                        value={alertForm.symptoms}
                        onChange={(e) => setAlertForm({ ...alertForm, symptoms: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Recommended Remedial & Preventative Measures *</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Specify spray dosage (e.g. Neem oil 1500 ppm or Bio-fungicide) and sanitation practices..."
                        value={alertForm.preventativeMeasures}
                        onChange={(e) => setAlertForm({ ...alertForm, preventativeMeasures: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowBroadcastModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger btn-sm fw-bold px-4"
                    disabled={submittingAlert}
                  >
                    {submittingAlert ? 'Broadcasting...' : 'Broadcast to All Farmers'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
