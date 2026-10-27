const mongoose = require('mongoose');

const forumThreadSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorRole: {
      type: String,
      enum: ['farmer', 'admin', 'expert'],
      default: 'farmer',
    },
    title: {
      type: String,
      required: [true, 'Please provide question title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please explain your question or discussion topic in detail'],
    },
    category: {
      type: String,
      enum: [
        'Crop Disease & Pests',
        'Soil & Fertilizers',
        'Irrigation & Water',
        'Weather & Seasons',
        'Machinery & Equipment',
        'Government Schemes',
      ],
      default: 'Crop Disease & Pests',
    },
    tags: [{ type: String }],
    upvotes: {
      type: Number,
      default: 0,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        authorName: { type: String, required: true },
        authorRole: { type: String, default: 'farmer' },
        content: { type: String, required: true },
        isExpertVerified: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ForumThread', forumThreadSchema);
