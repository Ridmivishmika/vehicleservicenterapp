import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema({
  no: { type: Number, default: 1 },
  code: { type: String, default: '' },
  supplierName: { type: String, default: '' },
  description: { type: String, required: true },
  qty: { type: Number, default: 1 },
  rate: { type: Number, default: 0 },
  dis: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  itemType: { type: String, default: 'item', enum: ['item', 'job'] }
}, { _id: false });

const ServicePartSchema = new mongoose.Schema({
  code: { type: String, default: '' },
  name: { type: String, default: '' },
  supplier: { type: String, default: '' },
  supplierName: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { _id: false });

const ServiceRecordSchema = new mongoose.Schema(
  {
    serviceNo: { type: String, required: true, trim: true },
    vehicleNo: { type: String, required: true, uppercase: true, trim: true, index: true },
    serviceDate: { type: String, required: true }, // Format: YYYY-MM-DD
    serviceTime: { type: String, default: '' },
    serviceType: { type: String, default: 'Full Service' },
    billingType: { type: String, default: 'Normal' },
    laborCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    technician: { type: String, default: '' },
    technicianNotes: { type: String, default: '' },
    checklist: [{ type: String }],
    partsTotal: { type: Number, default: 0 },
    jobTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    technician: { type: String, default: 'Senior Tech', trim: true },
    status: { type: String, default: 'Completed', enum: ['Completed', 'In Progress', 'Pending Delivery'] },
    nextServiceDate: { type: String, default: '' },
    nextServiceMeter: { type: Number, default: 0 },
    status: { type: String, default: 'Invoiced' },
    parts: [ServicePartSchema],
    items: [ServiceItemSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.ServiceRecord || mongoose.model('ServiceRecord', ServiceRecordSchema);
