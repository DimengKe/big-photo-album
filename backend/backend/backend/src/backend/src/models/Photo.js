const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  thumbnailPath: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  width: Number,
  height: Number,
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastViewed: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'active', 'deleted', 'error'],
    default: 'active'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// 索引
photoSchema.index({ userId: 1, uploadDate: -1 });
photoSchema.index({ userId: 1, tags: 1 });
photoSchema.index({ userId: 1, isFavorite: 1 });
photoSchema.index({ fileSize: 1 });

// 虚拟字段
photoSchema.virtual('thumbnailUrl').get(function() {
  return `/uploads/thumbnails/${this.thumbnailPath.split('/').pop()}`;
});

photoSchema.virtual('originalUrl').get(function() {
  return `/uploads/photos/${this.filePath.split('/').pop()}`;
});

// 实例方法
photoSchema.methods.incrementView = async function() {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};

photoSchema.methods.toggleFavorite = async function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// 静态方法
photoSchema.statics.getUserPhotos = async function(userId, page = 1, limit = 20, filter = {}) {
  const skip = (page - 1) * limit;
  
  return this.find({ userId, status: 'active', ...filter })
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

module.exports = mongoose.model('Photo', photoSchema);
