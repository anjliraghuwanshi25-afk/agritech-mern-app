import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Mail, Lock, Phone, MapPin, AlertCircle, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    phone: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      location: formData.location,
    });
    setLoading(false);

    if (res?.success) {
      navigate('/dashboard');
    } else {
      setError(res?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="agri-card p-4 p-sm-5 shadow-sm">
            <div className="text-center mb-4">
              <div className="bg-success-subtle text-success p-3 rounded-circle d-inline-flex mb-2">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold text-dark">Join AgriTech Network</h3>
              <p className="text-muted small">Create your account to unlock precision farming solutions</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Toggle Selector */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Select Account Type</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn flex-fill py-2 fw-semibold ${formData.role === 'farmer' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setFormData({ ...formData, role: 'farmer' })}
                  >
                    <Sprout size={16} className="me-1 d-inline" /> Farmer / Cultivator
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill py-2 fw-semibold ${formData.role === 'admin' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                  >
                    <Shield size={16} className="me-1 d-inline" /> Agricultural Officer (Admin)
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <User size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control border-start-0 ps-1"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-start-0 ps-1"
                    placeholder="farmer@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone & Location */}
              <div className="row g-2 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Phone size={16} className="text-muted" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control border-start-0 ps-1"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">State / District</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <MapPin size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="location"
                      className="form-control border-start-0 ps-1"
                      placeholder="e.g. Ludhiana, Punjab"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="row g-2 mb-4">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control border-start-0 ps-1"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control border-start-0 ps-1"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-agri w-100 py-2 fw-bold mb-3"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Create AgriTech Account
              </button>
            </form>

            <div className="text-center small text-secondary mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-agri-primary fw-bold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
