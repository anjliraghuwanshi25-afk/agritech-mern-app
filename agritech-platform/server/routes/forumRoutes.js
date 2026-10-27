const express = require('express');
const router = express.Router();
const {
  getThreads,
  getThreadById,
  createThread,
  addReply,
  upvoteThread,
} = require('../controllers/forumController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getThreads)
  .post(protect, createThread);

router.route('/:id')
  .get(getThreadById);

router.post('/:id/reply', protect, addReply);
router.put('/:id/upvote', protect, upvoteThread);

module.exports = router;
