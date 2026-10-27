import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  CheckCircle,
  Award,
  Search,
  Filter,
  User,
  ShieldCheck,
  Send,
} from 'lucide-react';

const FORUM_CATEGORIES = [
  'All',
  'Crop Disease & Pests',
  'Soil & Fertilizers',
  'Irrigation & Water',
  'Weather & Seasons',
  'Machinery & Equipment',
  'Government Schemes',
];

const ForumPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isExpertVerified, setIsExpertVerified] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  const [newThreadData, setNewThreadData] = useState({
    title: '',
    content: '',
    category: 'Crop Disease & Pests',
    tags: 'Wheat, Soil, Advice',
  });

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await API.get('/forum', { params });
      if (res.data?.success) {
        setThreads(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load forum threads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [activeCategory]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/forum', newThreadData);
      if (res.data?.success) {
        setShowNewThreadModal(false);
        setNewThreadData({
          title: '',
          content: '',
          category: 'Crop Disease & Pests',
          tags: 'Wheat, Soil, Advice',
        });
        fetchThreads();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating discussion thread');
    }
  };

  const handleOpenThread = async (threadId) => {
    try {
      const res = await API.get(`/forum/${threadId}`);
      if (res.data?.success) {
        setSelectedThread(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load thread details:', err);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await API.post(`/forum/${selectedThread._id}/reply`, {
        content: replyContent,
        isExpertVerified: isAdmin ? isExpertVerified : false,
      });

      if (res.data?.success) {
        setSelectedThread(res.data.data);
        setReplyContent('');
        setIsExpertVerified(false);
        fetchThreads();
      }
    } catch (err) {
      alert('Error submitting reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpvote = async (threadId) => {
    try {
      const res = await API.put(`/forum/${threadId}/upvote`);
      if (res.data?.success) {
        setThreads(
          threads.map((t) => (t._id === threadId ? { ...t, upvotes: res.data.upvotes } : t))
        );
        if (selectedThread && selectedThread._id === threadId) {
          setSelectedThread({ ...selectedThread, upvotes: res.data.upvotes });
        }
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded-4 shadow-sm border mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <MessageSquare className="text-success" /> Expert Consultation & Community Forums
          </h3>
          <p className="text-muted small mb-0">
            Post agronomy questions, share farming wisdom, and receive verified advisories from agricultural scientists.
          </p>
        </div>

        <button
          className="btn btn-agri fw-semibold d-flex align-items-center gap-2 px-4 shadow-sm"
          onClick={() => setShowNewThreadModal(true)}
        >
          <Plus size={18} /> Ask Question / Start Topic
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="agri-card p-3 bg-white shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              {FORUM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${
                    activeCategory === cat ? 'btn-success fw-bold' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchThreads();
              }}
              className="input-group"
            >
              <span className="input-group-text bg-white border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search forum topics: pest control, fertilizer dose, seed germination, subsidy schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-agri px-3">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Thread List Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : threads.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <MessageSquare size={48} className="text-muted mb-3" />
          <h5 className="fw-bold text-dark">No Questions In This Category</h5>
          <p className="text-muted small">Be the first farmer to ask a question or start a discussion!</p>
          <button className="btn btn-agri btn-sm" onClick={() => setShowNewThreadModal(true)}>
            Ask Question Now
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 mb-4">
          {threads.map((thread) => (
            <div key={thread._id} className="agri-card p-4 bg-white border shadow-sm">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-success-subtle text-success border border-success">
                      {thread.category}
                    </span>
                    {thread.isAnswered && (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning d-flex align-items-center gap-1">
                        <CheckCircle size={12} /> Solution Provided
                      </span>
                    )}
                    <small className="text-muted">
                      Posted by {thread.authorName}{' '}
                      <span className={`badge ${thread.authorRole === 'admin' ? 'bg-warning text-dark' : 'bg-light text-secondary border'}`}>
                        {thread.authorRole}
                      </span>
                    </small>
                  </div>

                  <h5
                    className="fw-bold text-dark mb-2 cursor-pointer text-hover-success"
                    onClick={() => handleOpenThread(thread._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {thread.title}
                  </h5>

                  <p className="text-muted small mb-3 line-clamp-2">
                    {thread.content}
                  </p>

                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {thread.tags?.map((t, idx) => (
                      <span key={idx} className="badge bg-light text-secondary border small">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side Upvote & Reply count */}
                <div className="text-end flex-shrink-0 d-flex flex-column align-items-end gap-2">
                  <button
                    className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleUpvote(thread._id)}
                  >
                    <ThumbsUp size={14} />
                    <span>{thread.upvotes}</span>
                  </button>

                  <button
                    className="btn btn-agri btn-sm fw-semibold"
                    onClick={() => handleOpenThread(thread._id)}
                  >
                    {thread.replies?.length || 0} Replies →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discussion Thread View & Reply Modal */}
      {selectedThread && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-agri-primary text-white">
                <h5 className="modal-title fw-bold text-truncate" style={{ maxWidth: '85%' }}>
                  {selectedThread.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedThread(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Question Details */}
                <div className="bg-light p-3 rounded-3 border mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <strong className="text-dark">{selectedThread.authorName}</strong>
                      <span className={`badge ${selectedThread.authorRole === 'admin' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {selectedThread.authorRole}
                      </span>
                    </div>
                    <span className="text-muted small">
                      {new Date(selectedThread.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-dark mb-0">{selectedThread.content}</p>
                </div>

                {/* Replies Thread */}
                <h6 className="fw-bold text-dark mb-3">
                  Responses & Agronomic Advice ({selectedThread.replies?.length || 0})
                </h6>

                {selectedThread.replies?.length === 0 ? (
                  <p className="text-muted small mb-4">No replies yet. Be the first to advise!</p>
                ) : (
                  <div className="d-flex flex-column gap-3 mb-4">
                    {selectedThread.replies.map((reply, rIdx) => (
                      <div
                        key={rIdx}
                        className={`p-3 rounded-3 border ${
                          reply.isExpertVerified
                            ? 'border-warning bg-warning bg-opacity-10'
                            : 'bg-white'
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <strong className="text-dark">{reply.authorName}</strong>
                            {reply.isExpertVerified && (
                              <span className="badge bg-warning text-dark fw-bold d-flex align-items-center gap-1">
                                <Award size={13} /> Certified Expert Advice
                              </span>
                            )}
                          </div>
                          <small className="text-muted">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-0 text-dark small">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleAddReply} className="pt-3 border-top">
                  <h6 className="fw-bold small text-secondary mb-2">Add Your Response / Agronomic Advice:</h6>
                  <textarea
                    rows="3"
                    className="form-control mb-2"
                    placeholder="Provide detailed agricultural advice or share your farming experience..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                  ></textarea>

                  {isAdmin && (
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="expertVerificationCheck"
                        checked={isExpertVerified}
                        onChange={(e) => setIsExpertVerified(e.target.checked)}
                      />
                      <label className="form-check-label small fw-semibold text-warning-emphasis" htmlFor="expertVerificationCheck">
                        Badge this reply as Certified Agricultural Officer Advice
                      </label>
                    </div>
                  )}

                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-agri btn-sm fw-bold px-4"
                      disabled={submittingReply}
                    >
                      {submittingReply ? 'Posting...' : 'Post Advice'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ask Question / Start Topic */}
      {showNewThreadModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-agri-primary text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={20} /> Ask Agricultural Question
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowNewThreadModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateThread}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Question Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Yellow leaves on wheat crop during 3rd irrigation"
                        value={newThreadData.title}
                        onChange={(e) => setNewThreadData({ ...newThreadData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={newThreadData.category}
                        onChange={(e) => setNewThreadData({ ...newThreadData, category: e.target.value })}
                      >
                        {FORUM_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Tags (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat, Fungus, Drip"
                        value={newThreadData.tags}
                        onChange={(e) => setNewThreadData({ ...newThreadData, tags: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Detailed Description *</label>
                      <textarea
                        rows="4"
                        className="form-control"
                        placeholder="Describe soil type, crop variety, weather patterns, and specific issues noticed in your field..."
                        value={newThreadData.content}
                        onChange={(e) => setNewThreadData({ ...newThreadData, content: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowNewThreadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm fw-bold px-4">
                    Submit Question
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

export default ForumPage;
