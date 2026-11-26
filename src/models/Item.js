import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    itemCode: { type: String, required: true, index: true, uppercase: true, trim: true },
    barcode: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    supplierName: { type: String, default: '', trim: true, index: true },
    qtyOnHand: { type: Number, default: 0 },
    stockUnit: { type: String, default: 'Units', trim: true },
    sellingPrice: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    category: { type: String, default: 'General', trim: true },
    stockDate: { type: String, default: '' },
    stockTime: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
