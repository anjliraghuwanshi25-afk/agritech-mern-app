import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemoFarmer, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res?.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    let res;
    if (role === 'farmer') {
      res = await loginAsDemoFarmer();
    } else {
      res = await loginAsDemoAdmin();
    }
    setLoading(false);

    if (res?.success) {
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } else {
      setError('Demo login failed. Make sure backend is running or database is seeded.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="agri-card p-4 p-sm-5 shadow-sm">
            <div className="text-center mb-4">
              <div className="bg-success-subtle text-success p-3 rounded-circle d-inline-flex mb-2">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold text-dark">Welcome to AgriTech</h3>
              <p className="text-muted small">Sign in to manage your farms, crops, and agro-orders</p>
            </div>

            {/* Quick Demo Fill Buttons for Project Evaluator */}
            <div className="bg-light p-3 rounded-3 border mb-4">
              <span className="small fw-bold text-secondary d-block mb-2 text-center">
                🚀 One-Click Demo Access for Project Presentation:
              </span>
              <div className="d-grid gap-2 d-sm-flex">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm flex-fill fw-bold d-flex align-items-center justify-content-center gap-1"
                  onClick={() => handleQuickLogin('farmer')}
                  disabled={loading}
                >
                  <UserCheck size={16} /> Farmer Demo
                </button>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm flex-fill fw-bold text-dark d-flex align-items-center justify-content-center gap-1"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={loading}
                >
                  <ShieldCheck size={16} /> Admin Demo
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-1"
                    placeholder="e.g. farmer@agritech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-1"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
                Sign In to AgriTech
              </button>
            </form>

            <div className="text-center small text-secondary mt-3">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-agri-primary fw-bold text-decoration-none">
                Register as a Farmer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
