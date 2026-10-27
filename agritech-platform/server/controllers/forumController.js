const ForumThread = require('../models/ForumThread');

// @desc    Get all forum threads
// @route   GET /api/forum
// @access  Public
const getThreads = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const threads = await ForumThread.find(query)
      .populate('author', 'name role avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: threads.length, data: threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single thread with replies
// @route   GET /api/forum/:id
// @access  Public
const getThreadById = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id)
      .populate('author', 'name role avatar')
      .populate('replies.author', 'name role avatar');

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Discussion thread not found' });
    }

    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new question or discussion thread
// @route   POST /api/forum
// @access  Private
const createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question title and content description',
      });
    }

    const thread = await ForumThread.create({
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      title,
      content,
      category: category || 'Crop Disease & Pests',
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : ['Agriculture'],
      replies: [],
    });

    res.status(201).json({
      success: true,
      message: 'Discussion topic posted successfully',
      data: thread,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add reply or expert advice to thread
// @route   POST /api/forum/:id/reply
// @access  Private
const addReply = async (req, res) => {
  try {
    const { content, isExpertVerified } = req.body;
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be empty' });
    }

    const reply = {
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content,
      isExpertVerified: req.user.role === 'admin' ? Boolean(isExpertVerified) : false,
      createdAt: new Date(),
    };

    thread.replies.push(reply);
    thread.isAnswered = true;
    await thread.save();

    res.status(201).json({
      success: true,
      message: 'Reply submitted',
      data: thread,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upvote thread
// @route   PUT /api/forum/:id/upvote
// @access  Private
const upvoteThread = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    thread.upvotes += 1;
    await thread.save();

    res.json({ success: true, upvotes: thread.upvotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getThreads,
  getThreadById,
  createThread,
  addReply,
  upvoteThread,
};
