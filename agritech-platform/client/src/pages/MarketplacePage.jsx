import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Check,
  ShoppingCart,
  CheckCircle,
  Eye,
  Info,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Seeds',
  'Fertilizers',
  'Pesticides & Bio-agents',
  'Machinery & Tools',
  'Irrigation Equipment',
];

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState({});

  const { addToCart, cartCount } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchQuery) params.search = searchQuery;
      if (sortBy !== 'default') params.sort = sortBy;

      const res = await API.get('/products', { params });
      if (res.data?.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedAnimation({ ...addedAnimation, [product._id]: true });
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded-4 shadow-sm border mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <ShoppingBag className="text-success" /> Agricultural Resource Store
          </h3>
          <p className="text-muted small mb-0">
            Procure certified hybrid seeds, slow-release fertilizers, bio-defenses, and precision irrigation tools.
          </p>
        </div>

        <Link
          to="/orders"
          className="btn btn-agri d-flex align-items-center gap-2 fw-semibold px-4 shadow-sm"
        >
          <ShoppingCart size={18} />
          <span>View Cart & Checkout</span>
          {cartCount > 0 && (
            <span className="badge bg-warning text-dark rounded-pill ms-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="agri-card p-3 bg-white shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          {/* Category Tabs */}
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${
                    activeCategory === cat
                      ? 'btn-success fw-bold'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="col-md-8">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search certified seeds, fertilizers, neem spray, drip pipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-agri px-3">
                Search
              </button>
            </form>
          </div>

          {/* Sort Dropdown */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <ShoppingBag size={48} className="text-muted mb-3" />
          <h5 className="fw-bold text-dark">No Products Found</h5>
          <p className="text-muted small">Try broadening your search term or selecting another category.</p>
          <button className="btn btn-agri btn-sm" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-sm-6 col-lg-4">
              <div className="agri-card h-100 bg-white border d-flex flex-column justify-content-between overflow-hidden">
                <div>
                  {/* Product Image */}
                  <div className="position-relative" style={{ height: 180, overflow: 'hidden' }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="position-absolute top-0 start-0 m-2 badge bg-success text-white">
                      {product.category}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">
                        Only {product.stock} left!
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted fw-semibold">{product.brand}</small>
                      <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={14} fill="currentColor" />
                        <span className="fw-bold text-dark">{product.rating}</span>
                        <span className="text-muted">({product.numReviews})</span>
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-1 text-truncate" title={product.name}>
                      {product.name}
                    </h6>

                    <p className="small text-muted mb-2 line-clamp-2" style={{ height: 38, overflow: 'hidden' }}>
                      {product.description}
                    </p>

                    <div className="d-flex align-items-baseline gap-2 mb-2">
                      <h5 className="fw-bold text-success mb-0">₹ {product.price.toLocaleString()}</h5>
                      {product.originalPrice > product.price && (
                        <small className="text-muted text-decoration-line-through">
                          ₹ {product.originalPrice.toLocaleString()}
                        </small>
                      )}
                      <small className="text-muted">/ {product.unit}</small>
                    </div>

                    {product.suitableFor?.length > 0 && (
                      <div className="small text-muted mb-2">
                        <span className="text-secondary fw-semibold">Suitable for: </span>
                        {product.suitableFor.slice(0, 3).map((crop, idx) => (
                          <span key={idx} className="badge bg-light text-dark border me-1">
                            {crop}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 pt-0 border-top mt-2 pt-3 d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm flex-grow-0 px-2"
                    onClick={() => setSelectedProduct(product)}
                    title="Quick Details"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    className={`btn btn-sm flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                      addedAnimation[product._id]
                        ? 'btn-success'
                        : 'btn-agri'
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    {addedAnimation[product._id] ? (
                      <>
                        <Check size={16} /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-agri-primary text-white">
                <h5 className="modal-title fw-bold">{selectedProduct.name}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedProduct(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-5">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="img-fluid rounded-3 border"
                      style={{ maxHeight: 260, width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-7">
                    <span className="badge bg-success-subtle text-success mb-2">
                      {selectedProduct.category}
                    </span>
                    <h5 className="fw-bold text-dark">{selectedProduct.name}</h5>
                    <p className="text-muted small mb-2">Brand: {selectedProduct.brand}</p>
                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <h3 className="fw-bold text-success mb-0">₹ {selectedProduct.price.toLocaleString()}</h3>
                      <span className="text-muted">/ {selectedProduct.unit}</span>
                    </div>

                    <p className="text-secondary small mb-3">{selectedProduct.description}</p>

                    <div className="bg-light p-3 rounded-3 small mb-3">
                      <div><strong>Stock Availability:</strong> {selectedProduct.stock} units remaining</div>
                      <div><strong>Rating:</strong> {selectedProduct.rating} / 5.0 ({selectedProduct.numReviews} Verified Farmers)</div>
                      <div><strong>Recommended Crops:</strong> {selectedProduct.suitableFor?.join(', ')}</div>
                    </div>

                    <button
                      className="btn btn-agri w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                    >
                      <ShoppingCart size={18} /> Add to Cart Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
