import React, { useState, useEffect } from 'react';
import API from '../services/api';
import SoilHealthGauge from '../components/SoilHealthGauge';
import {
  Sprout,
  Plus,
  Activity,
  Layers,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CROP_STAGES = [
  'Sowing',
  'Germination',
  'Vegetative',
  'Flowering',
  'Yield Formation',
  'Ripening',
  'Harvested',
];

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCropAdvisory, setSelectedCropAdvisory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    cropCategory: 'Cereal',
    variety: '',
    areaPlanted: 1,
    plantingDate: new Date().toISOString().split('T')[0],
    stage: 'Vegetative',
    healthStatus: 'Good',
    soilHealth: {
      nitrogen: 320,
      phosphorus: 24,
      potassium: 210,
      soilPh: 6.8,
      moisturePercentage: 65,
      organicCarbon: 0.85,
    },
    pestThreatLevel: 'Low',
    advisoryNotes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([
        API.get('/crops'),
        API.get('/farms'),
      ]);
      setCrops(cropsRes.data?.data || []);
      setFarms(farmsRes.data?.data || []);
      if (farmsRes.data?.data?.length > 0) {
        setFormData((prev) => ({ ...prev, farmId: farmsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load crop monitoring telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSoilChange = (field, value) => {
    setFormData({
      ...formData,
      soilHealth: {
        ...formData.soilHealth,
        [field]: Number(value),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmId) {
      alert('Please select or register a farm first');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/crops', formData);
      if (res.data?.success) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error monitoring new crop');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStageUpdate = async (cropId, newStage) => {
    try {
      await API.put(`/crops/${cropId}`, { stage: newStage });
      setCrops(
        crops.map((c) => (c._id === cropId ? { ...c, stage: newStage } : c))
      );
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  const handleOpenAdvisory = async (cropId) => {
    try {
      const res = await API.get(`/crops/${cropId}/advisory`);
      if (res.data?.success) {
        setSelectedCropAdvisory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch advisory:', err);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (window.confirm('Delete this crop monitoring cycle?')) {
      try {
        await API.delete(`/crops/${cropId}`);
        setCrops(crops.filter((c) => c._id !== cropId));
      } catch (err) {
        alert('Failed to delete crop');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Sprout className="text-success" /> Crop Monitoring & Soil Health Analysis
          </h3>
          <p className="text-muted small mb-0">
            Real-time stage tracking, NPK chemical telemetry, and AI diagnostic agronomy guidance.
          </p>
        </div>
        <button
          className="btn btn-agri fw-semibold d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Monitor New Crop
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : crops.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <Sprout size={48} className="text-muted mb-3" />
          <h5 className="fw-bold text-dark">No Crops Under Monitoring</h5>
          <p className="text-muted small max-w-md mx-auto mb-4">
            Plant or track your first crop to sync soil telemetry (Nitrogen, Phosphorus, Potassium, Moisture, and pH) with automated agronomic advisories.
          </p>
          <button className="btn btn-agri" onClick={() => setShowModal(true)}>
            Start Monitoring Crop
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-lg-6">
              <div className="agri-card p-4 bg-white h-100 shadow-sm border d-flex flex-column justify-content-between">
                <div>
                  {/* Top Bar */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">{crop.cropName}</h5>
                      <span className="badge bg-secondary-subtle text-secondary me-2">
                        {crop.variety}
                      </span>
                      <span className="badge bg-light text-dark border">
                        {crop.areaPlanted} Acres • {crop.cropCategory}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm border-0"
                      onClick={() => handleDeleteCrop(crop._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-muted small mb-3">
                    <Layers size={13} className="me-1 text-success d-inline" />
                    <strong>Farm:</strong> {crop.farm?.farmName || 'Assigned Farm'} ({crop.farm?.location || 'Local field'})
                  </p>

                  {/* Stage Tracker Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span><strong>Growth Stage:</strong> {crop.stage}</span>
                      <span>Planted: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${((CROP_STAGES.indexOf(crop.stage) + 1) / CROP_STAGES.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {/* Quick stage selector */}
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {CROP_STAGES.map((stg) => (
                        <button
                          key={stg}
                          className={`btn btn-xs py-0 px-2 rounded-pill ${
                            crop.stage === stg
                              ? 'btn-success fw-bold'
                              : 'btn-outline-secondary'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                          onClick={() => handleStageUpdate(crop._id, stg)}
                        >
                          {stg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Soil Health Telemetry Section */}
                  <div className="mb-3">
                    <SoilHealthGauge
                      soilHealth={crop.soilHealth}
                      healthStatus={crop.healthStatus}
                    />
                  </div>
                </div>

                {/* Footer Advisory Action */}
                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted fst-italic text-truncate me-2" style={{ maxWidth: '60%' }}>
                    "{crop.advisoryNotes}"
                  </span>
                  <button
                    className="btn btn-outline-agri btn-sm fw-bold d-flex align-items-center gap-1"
                    onClick={() => handleOpenAdvisory(crop._id)}
                  >
                    <Sparkles size={14} /> Diagnostic Tips
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Soil Advisory Modal */}
      {selectedCropAdvisory && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Sparkles size={20} /> Soil Health Diagnostic Advisory: {selectedCropAdvisory.cropName}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedCropAdvisory(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-4">
                  <div>
                    <span className="text-secondary small fw-bold">Overall Soil Nutrient Index</span>
                    <h3 className="fw-bold text-success mb-0">{selectedCropAdvisory.overallScore} / 100</h3>
                  </div>
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {selectedCropAdvisory.healthGrade} Condition
                  </span>
                </div>

                <h6 className="fw-bold text-dark mb-3">Field Action Recommendations:</h6>
                <div className="d-flex flex-column gap-3">
                  {selectedCropAdvisory.recommendations?.map((rec, idx) => (
                    <div key={idx} className="p-3 border rounded-3 bg-white shadow-xs">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark">{rec.parameter}</strong>
                        <span className={`badge ${rec.status === 'Optimal' || rec.status === 'Sufficient' || rec.status === 'Neutral / Balanced' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {rec.status} ({rec.value})
                        </span>
                      </div>
                      <p className="mb-0 text-muted small">
                        <strong>Remedial Step:</strong> {rec.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedCropAdvisory(null)}
                >
                  Close Advisory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Monitor New Crop */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-agri-primary text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={20} /> Register Crop For Monitoring
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Select Farm Plot *</label>
                      <select
                        name="farmId"
                        className="form-select"
                        value={formData.farmId}
                        onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                        required
                      >
                        {farms.map((f) => (
                          <option key={f._id} value={f._id}>
                            {f.farmName} ({f.totalArea} {f.areaUnit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat (Sharbati Golden)"
                        value={formData.cropName}
                        onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Crop Category</label>
                      <select
                        className="form-select"
                        value={formData.cropCategory}
                        onChange={(e) => setFormData({ ...formData, cropCategory: e.target.value })}
                      >
                        <option value="Cereal">Cereal</option>
                        <option value="Pulse">Pulse</option>
                        <option value="Cash Crop">Cash Crop</option>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Oilseed">Oilseed</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Variety / Hybrid Seed</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. HD-3086"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Planted Area (Acres) *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.areaPlanted}
                        onChange={(e) => setFormData({ ...formData, areaPlanted: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Growth Stage</label>
                      <select
                        className="form-select"
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      >
                        {CROP_STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">General Health Status</label>
                      <select
                        className="form-select"
                        value={formData.healthStatus}
                        onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                      >
                        <option value="Optimal">Optimal</option>
                        <option value="Good">Good</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    {/* Soil chemical metrics */}
                    <div className="col-12 mt-3 pt-3 border-top">
                      <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-1">
                        <Activity size={18} /> Soil Test Readings (Telemetry)
                      </h6>
                      <div className="row g-2">
                        <div className="col-4">
                          <label className="form-label small">Nitrogen (kg/ha)</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={formData.soilHealth.nitrogen}
                            onChange={(e) => handleSoilChange('nitrogen', e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small">Phosphorus (kg/ha)</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={formData.soilHealth.phosphorus}
                            onChange={(e) => handleSoilChange('phosphorus', e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small">Potassium (kg/ha)</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={formData.soilHealth.potassium}
                            onChange={(e) => handleSoilChange('potassium', e.target.value)}
                          />
                        </div>
                        <div className="col-6 mt-2">
                          <label className="form-label small">Soil pH (0-14)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-control form-control-sm"
                            value={formData.soilHealth.soilPh}
                            onChange={(e) => handleSoilChange('soilPh', e.target.value)}
                          />
                        </div>
                        <div className="col-6 mt-2">
                          <label className="form-label small">Moisture (%)</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={formData.soilHealth.moisturePercentage}
                            onChange={(e) => handleSoilChange('moisturePercentage', e.target.value)}
                          />
                        </div>
                      </div>
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
                    {submitting ? 'Registering...' : 'Start Monitoring'}
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

export default CropsPage;
