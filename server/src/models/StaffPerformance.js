const mongoose = require('mongoose');

const staffPerformanceSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    summary: {
      totalTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 },
      pendingTasks: { type: Number, default: 0 },
      inProgressTasks: { type: Number, default: 0 },
      cancelledTasks: { type: Number, default: 0 },
    },
    performanceMetrics: {
      completionRate: { type: Number, default: 0 },
      onTimeCompletionRate: { type: Number, default: 0 },
      averageCompletionTime: { type: String, default: '0h 0m' },
      averageResponseTime: { type: String, default: '0m' },
    },
    rating: {
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    monthlyPerformance: [
      {
        month: String,
        completed: Number,
        onTime: Number,
      },
    ],
    categoryPerformance: [
      {
        category: String,
        completed: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StaffPerformance', staffPerformanceSchema);