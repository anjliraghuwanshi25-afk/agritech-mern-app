import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Sprout, ShoppingCart, User, ShieldCheck, CloudSun, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-agri-primary sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo & Tagline */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/">
          <div className="bg-white text-success rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
            <Sprout size={24} className="text-success" />
          </div>
          <span>AgriTech</span>
          <span className="badge bg-success-subtle text-success fs-7 fw-normal d-none d-sm-inline-block">
            Smart Farming
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agriNavbarContent"
          aria-controls="agriNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="agriNavbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 ps-lg-3">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/">
                Home
              </NavLink>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/farms">
                    Farms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/crops">
                    Crops & Soil
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/weather">
                Weather & Pests
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/marketplace">
                Agri Store
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/forum">
                Community
              </NavLink>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold active text-warning' : 'opacity-90'}`} to="/orders">
                  Orders
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link badge bg-warning text-dark align-self-center my-1 px-2 py-1 ms-lg-2 ${isActive ? 'fw-bold border border-light' : ''}`} to="/admin">
                  <ShieldCheck size={14} className="me-1 d-inline" />
                  Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Items */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {/* Cart Link */}
            <Link to="/orders" className="btn btn-outline-light position-relative btn-sm d-flex align-items-center gap-1 px-3">
              <ShoppingCart size={18} />
              <span className="d-none d-md-inline">Cart</span>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons / User Profile */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-light btn-sm dropdown-toggle d-flex align-items-center gap-2 fw-semibold px-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: 24, height: 24, objectFit: 'cover' }}
                  />
                  <span className="d-none d-sm-inline">{user.name.split(' ')[0]}</span>
                  <span className={`badge ${isAdmin ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold">{user.name}</p>
                    <small className="text-muted">{user.email}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/dashboard">
                      Farmer Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/orders">
                      My Orders & Shipments
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2 text-warning-emphasis fw-semibold" to="/admin">
                        Admin Control Center
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm fw-semibold px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm fw-bold px-3 text-dark">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
