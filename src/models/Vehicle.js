import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema(
  {
    rNo: { type: String, required: true, trim: true },
    vehicleNo: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    tagNo: { type: String, default: '', trim: true },
    csName: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
    mobileTel: { type: String, default: '', trim: true },
    homeTel: { type: String, default: '', trim: true },
    officeTel: { type: String, default: '', trim: true },
    city: { type: String, default: 'Colombo', trim: true },
    csStatus: { type: String, default: 'Regular', trim: true },
    vType: { type: String, default: 'Car', trim: true },
    vModel: { type: String, default: 'Toyota Prius', trim: true },
    colour: { type: String, default: 'Pearl White', trim: true },
    engineNo: { type: String, default: '', trim: true },
    chassisNo: { type: String, default: '', trim: true },
    birthDay: { type: String, default: '' },
    deliveryDate: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

// Prevent mongoose model overwrite error during hot reload
export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
