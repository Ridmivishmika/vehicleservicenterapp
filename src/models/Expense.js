import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    expenseNo: { type: String, required: true, trim: true },
    expenseDate: { type: String, required: true }, // YYYY-MM-DD
    category: {
      type: String,
      required: true,
      default: 'Maintenance',
      trim: true
    },
    payeeType: { type: String, default: 'Other', enum: ['Other', 'Worker', 'Vendor'] },
    payee: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    txnType: { type: String, default: 'Expense', trim: true },
    paymentMethod: { type: String, default: 'Cash', enum: ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Credit (Pay Later)'] },
    status: { type: String, default: 'Paid', enum: ['Paid', 'Should Pay Today', 'Pending'] },
    dueDate: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
