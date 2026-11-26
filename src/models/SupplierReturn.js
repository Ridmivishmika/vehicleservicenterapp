import mongoose from 'mongoose';

const SupplierReturnSchema = new mongoose.Schema(
  {
    returnNo: { type: String, required: true, trim: true },
    returnDate: { type: String, required: true },
    returnTime: { type: String, default: '' },
    itemId: { type: String, default: '' },
    itemCode: { type: String, default: '', trim: true, uppercase: true },
    barcode: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    supplierName: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    stockUnit: { type: String, default: 'Units', trim: true },
    returnQty: { type: Number, required: true, default: 1 },
    costPrice: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 },
    reason: { type: String, default: 'Old / Expired Stock', trim: true },
    refundMethod: {
      type: String,
      default: 'Deduct from Supplier Balance',
      enum: ['Deduct from Supplier Balance', 'Cash Refund', 'Credit Note']
    },
    notes: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.SupplierReturn || mongoose.model('SupplierReturn', SupplierReturnSchema);
