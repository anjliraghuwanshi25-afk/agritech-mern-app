import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Layers, Plus, MapPin, Droplets, Trash2, Edit3, CheckCircle, Sprout, AlertCircle } from 'lucide-react';

const FarmsPage = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    totalArea: '',
    areaUnit: 'Acres',
    soilType: 'Alluvial Soil',
    irrigationType: 'Drip Irrigation',
    status: 'Active',
    notes: '',
  });

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/farms');
      if (res.data?.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await API.post('/farms', formData);
      if (res.data?.success) {
        setSuccess('Farm registered successfully!');
        setShowModal(false);
        setFormData({
          farmName: '',
          location: '',
          totalArea: '',
          areaUnit: 'Acres',
          soilType: 'Alluvial Soil',
          irrigationType: 'Drip Irrigation',
          status: 'Active',
          notes: '',
        });
        fetchFarms();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering farm');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm? Associated crop records will also be removed.')) {
      try {
        await API.delete(`/farms/${farmId}`);
        setFarms(farms.filter((f) => f._id !== farmId));
      } catch (err) {
        alert('Failed to delete farm');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header Bar */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Layers className="text-success" /> Farm Profile Setup & Management
          </h3>
          <p className="text-muted small mb-0">
            Register and configure your land parcels, soil composition, and irrigation equipment.
          </p>
        </div>
        <button
          className="btn btn-agri fw-semibold d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Register New Farm
        </button>
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Farms Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <Layers size={48} className="text-muted mb-3" />
          <h5 className="fw-bold text-dark">No Farm Profiles Registered Yet</h5>
          <p className="text-muted small max-w-md mx-auto mb-4">
            Add your agricultural land details to begin monitoring soil health, crop schedules, and localized pest warnings.
          </p>
          <button className="btn btn-agri" onClick={() => setShowModal(true)}>
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 bg-white h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-success-subtle text-success border border-success fw-semibold">
                      {farm.status}
                    </span>
                    <button
                      className="btn btn-outline-danger btn-sm border-0"
                      onClick={() => handleDelete(farm._id)}
                      title="Delete Farm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{farm.farmName}</h5>
                  <p className="text-muted small mb-3 d-flex align-items-center gap-1">
                    <MapPin size={14} className="text-danger" /> {farm.location}
                  </p>

                  <div className="bg-light p-3 rounded-3 small mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Total Land Area:</span>
                      <strong className="text-dark">{farm.totalArea} {farm.areaUnit}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Soil Type:</span>
                      <strong className="text-dark">{farm.soilType}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Irrigation Mode:</span>
                      <strong className="text-dark">{farm.irrigationType}</strong>
                    </div>
                  </div>

                  {farm.notes && (
                    <p className="small text-muted fst-italic mb-3">
                      "{farm.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-top d-flex justify-content-between align-items-center small">
                  <span className="text-muted">Registered: {new Date(farm.createdAt).toLocaleDateString()}</span>
                  <a href="/crops" className="text-agri-primary fw-bold text-decoration-none">
                    View Crops →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Register New Farm */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-agri-primary text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={20} /> Register New Farm Profile
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {error && (
                    <div className="alert alert-danger py-2 small mb-3">{error}</div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Farm Name / Plot Identifier *</label>
                      <input
                        type="text"
                        name="farmName"
                        className="form-control"
                        placeholder="e.g. Green Valley Farm"
                        value={formData.farmName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Location (Village / Tehsil / District) *</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="e.g. Samrala, Ludhiana, Punjab"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Total Area *</label>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          name="totalArea"
                          className="form-control"
                          placeholder="e.g. 5.5"
                          value={formData.totalArea}
                          onChange={handleChange}
                          required
                        />
                        <select
                          name="areaUnit"
                          className="form-select"
                          value={formData.areaUnit}
                          onChange={handleChange}
                          style={{ maxWidth: 120 }}
                        >
                          <option value="Acres">Acres</option>
                          <option value="Hectares">Hectares</option>
                          <option value="Bigha">Bigha</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Soil Type *</label>
                      <select
                        name="soilType"
                        className="form-select"
                        value={formData.soilType}
                        onChange={handleChange}
                      >
                        <option value="Alluvial Soil">Alluvial Soil</option>
                        <option value="Black Soil (Regur)">Black Soil (Regur)</option>
                        <option value="Red & Yellow Soil">Red & Yellow Soil</option>
                        <option value="Clay Soil">Clay Soil</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Laterite Soil">Laterite Soil</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Primary Irrigation System *</label>
                      <select
                        name="irrigationType"
                        className="form-select"
                        value={formData.irrigationType}
                        onChange={handleChange}
                      >
                        <option value="Drip Irrigation">Drip Irrigation</option>
                        <option value="Sprinkler System">Sprinkler System</option>
                        <option value="Canal Irrigation">Canal Irrigation</option>
                        <option value="Tube Well">Tube Well</option>
                        <option value="Rainfed">Rainfed</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Field Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Active">Active (Cultivated)</option>
                        <option value="Prepared for Sowing">Prepared for Sowing</option>
                        <option value="Fallow">Fallow (Resting Period)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Field Notes & Observations</label>
                      <textarea
                        name="notes"
                        rows="3"
                        className="form-control"
                        placeholder="Add notes about previous harvest, fertilizer history, or soil amendments..."
                        value={formData.notes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-agri btn-sm fw-bold px-4"
                    disabled={submitting}
                  >
                    {submitting ? 'Registering...' : 'Save Farm Profile'}
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

export default FarmsPage;
