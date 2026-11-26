import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  jobCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  jobName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'Vehicle Service', // Vehicle Service | Car Wash | Mechanical | Diagnostics | Other
    trim: true
  },
  standardLaborFee: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  nextServiceOdometer: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedDuration: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  defaultChecklist: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
