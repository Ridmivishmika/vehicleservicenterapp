import mongoose from 'mongoose';

const SupplierPaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    paymentDate: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: 'Cheque', enum: ['Cheque', 'Cash', 'Bank Transfer'] },
    chequeNo: { type: String, default: '' },
    chequeIssueDate: { type: String, default: '' },
    chequeStatus: { type: String, default: 'Issued', enum: ['Issued', 'Cleared', 'Bounced'] },
    clearedDate: { type: String, default: '' },
    bankAccount: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const SupplierInvoiceItemSchema = new mongoose.Schema(
  {
    itemCode: { type: String, default: '' },
    description: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { _id: false }
);

const SupplierInvoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, trim: true }, // e.g. "198"
    supplierName: { type: String, required: true, trim: true, index: true },
    invoiceNo: { type: String, required: true, trim: true }, // e.g. "285"
    poGrnNo: { type: String, default: '', trim: true }, // e.g. "ACSC199"
    receivedDate: { type: String, required: true }, // YYYY-MM-DD
    invoiceDate: { type: String, required: true }, // YYYY-MM-DD
    invoiceAmount: { type: Number, required: true, default: 0 },
    creditDays: { type: Number, default: 30 },
    dueDate: { type: String, required: true }, // YYYY-MM-DD
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    status: { type: String, default: 'ONGOING', enum: ['ONGOING', 'OVERDUE', 'PAID'] },
    items: [SupplierInvoiceItemSchema],
    payments: [SupplierPaymentSchema],
    notes: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.SupplierInvoice || mongoose.model('SupplierInvoice', SupplierInvoiceSchema);
