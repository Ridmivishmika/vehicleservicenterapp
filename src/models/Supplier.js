import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true, unique: true, trim: true },
    contactPerson: { type: String, default: '', trim: true },
    telephone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    defaultCreditDays: { type: Number, default: 30 },
    suppliedCategories: [{ type: String }],
    notes: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
