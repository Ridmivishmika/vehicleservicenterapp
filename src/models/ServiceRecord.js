import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema({
  no: { type: Number, default: 1 },
  code: { type: String, default: '' },
  supplierName: { type: String, default: '' },
  description: { type: String, default: '' },
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
    serviceNo: { type: String, default: '', trim: true },
    invoiceNo: { type: String, default: '', trim: true, index: true },
    vehicleNo: { type: String, required: true, uppercase: true, trim: true, index: true },
    customerType: { type: String, default: 'Regular', trim: true },
    csName: { type: String, default: '', trim: true },
    csAddress: { type: String, default: '', trim: true },
    telephone: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    vModel: { type: String, default: '', trim: true },
    engineNo: { type: String, default: '', trim: true },
    chassisNo: { type: String, default: '', trim: true },
    serviceDate: { type: String, required: true }, // Format: YYYY-MM-DD
    serviceTime: { type: String, default: '' },
    serviceType: { type: String, default: 'Full Service' },
    billingType: { type: String, default: 'Normal' },
    paymentType: { type: String, default: 'CASH' },
    jobDetails: { type: String, default: '' },
    jobDone: { type: String, default: 'Completed' },
    meterReading: { type: Number, default: 0 },
    odometer: { type: Number, default: 0 },
    laborCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    totalDis: { type: Number, default: 0 },
    partsTotal: { type: Number, default: 0 },
    jobTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    billTotal: { type: Number, default: 0 },
    technician: { type: String, default: 'Staff', trim: true },
    technicianNotes: { type: String, default: '' },
    checklist: [{ type: String }],
    nextServiceDate: { type: String, default: '' },
    nextServiceMeter: { type: Number, default: 0 },
    reminderSent: { type: Boolean, default: false },
    reminderSentAt: { type: String, default: '' },
    status: { type: String, default: 'Invoiced' },
    parts: [ServicePartSchema],
    items: [ServiceItemSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.ServiceRecord || mongoose.model('ServiceRecord', ServiceRecordSchema);
