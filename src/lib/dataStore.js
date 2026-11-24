import mongoose from 'mongoose';
import { connectToDatabase, isDbConnected } from './mongodb';
import Vehicle from '@/models/Vehicle';
import Item from '@/models/Item';
import ServiceRecord from '@/models/ServiceRecord';
import Supplier from '@/models/Supplier';
import SupplierInvoice from '@/models/SupplierInvoice';
import Expense from '@/models/Expense';
import Job from '@/models/Job';
import { 
  mockVehicles, 
  mockItems, 
  mockServices, 
  mockSuppliers, 
  mockSupplierInvoices, 
  mockExpenses,
  mockJobs,
  getMockVehicles, 
  getMockItems, 
  getMockServices,
  getMockSuppliers,
  getMockSupplierInvoices,
  getMockExpenses,
  getMockJobs
} from './mockStore';

let idCounter = 0;
export function generateUniqueId(prefix = 'id') {
  idCounter = (idCounter + 1) % 100000;
  return `${prefix}_${Date.now()}_${idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

// === VEHICLES ===
export async function getVehicles() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const docs = await Vehicle.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getVehicles:', err.message);
  }
  return getMockVehicles().map(v => ({ ...v, id: v._id || v.id }));
}

export async function createVehicle(data) {
  const cleanData = {
    ...data,
    vehicleNo: data.vehicleNo.trim().toUpperCase(),
    rNo: data.rNo || `R-${String(Date.now()).slice(-3)}`
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Vehicle.create(cleanData);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for createVehicle:', err.message);
  }

  const list = getMockVehicles();
  const uid = generateUniqueId('veh');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  list.unshift(newObj);
  return newObj;
}

export async function updateVehicle(id, data) {
  if (data.vehicleNo) data.vehicleNo = data.vehicleNo.trim().toUpperCase();

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for updateVehicle:', err.message);
  }

  const list = getMockVehicles();
  const idx = list.findIndex(v => v._id === id || v.id === id || v.vehicleNo === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...data };
    return list[idx];
  }
  return null;
}

export async function deleteVehicle(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await Vehicle.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteVehicle:', err.message);
  }

  const list = getMockVehicles();
  const idx = list.findIndex(v => v._id === id || v.id === id || v.vehicleNo === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

// === ITEMS ===
export async function getItems() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const docs = await Item.find().sort({ itemCode: 1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getItems:', err.message);
  }
  return getMockItems().map(i => ({ ...i, id: i._id || i.id }));
}

export async function createItem(data) {
  const cleanData = {
    itemCode: (data.itemCode || `ITM-${String(Date.now()).slice(-4)}`).trim().toUpperCase(),
    barcode: (data.barcode || '').trim(),
    description: (data.description || '').trim(),
    supplierName: (data.supplierName || '').trim(),
    category: (data.category || 'General').trim(),
    qtyOnHand: Number(data.qtyOnHand) || 0,
    costPrice: Number(data.costPrice) || 0,
    sellingPrice: Number(data.sellingPrice) || 0,
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Item.create(cleanData);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for createItem:', err.message);
  }

  const list = getMockItems();
  const uid = generateUniqueId('itm');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  list.push(newObj);
  return newObj;
}

export async function updateItem(id, data) {
  if (data.itemCode) data.itemCode = data.itemCode.trim().toUpperCase();
  if (data.qtyOnHand !== undefined) data.qtyOnHand = Number(data.qtyOnHand);
  if (data.costPrice !== undefined) data.costPrice = Number(data.costPrice);
  if (data.sellingPrice !== undefined) data.sellingPrice = Number(data.sellingPrice);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Item.findByIdAndUpdate(id, data, { new: true }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for updateItem:', err.message);
  }

  const list = getMockItems();
  const idx = list.findIndex(i => i._id === id || i.id === id || i.itemCode === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
    return list[idx];
  }
  return null;
}

export async function deleteItem(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await Item.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteItem:', err.message);
  }

  const list = getMockItems();
  const idx = list.findIndex(i => i._id === id || i.id === id || i.itemCode === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

// === SERVICES / REVENUE ===
export async function getServicesByVehicleNo(vehicleNo) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      let query = {};
      if (vehicleNo) {
        query.vehicleNo = vehicleNo.trim().toUpperCase();
      }
      const docs = await ServiceRecord.find(query).sort({ serviceDate: -1, createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getServices:', err.message);
  }

  let list = getMockServices();
  if (vehicleNo) {
    const vNo = vehicleNo.trim().toUpperCase();
    list = list.filter(s => s.vehicleNo.toUpperCase() === vNo);
  }
  list.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
  return list.map(s => ({ ...s, id: s._id || s.id }));
}

export async function getServiceRecordById(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await ServiceRecord.findById(id).lean();
      }
      if (!doc) {
        doc = await ServiceRecord.findOne({
          $or: [{ invoiceNo: id }, { serviceNo: id }, { _id: id }]
        }).lean();
      }
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for getServiceRecordById:', err.message);
  }

  const list = getMockServices();
  const found = list.find(s => s._id === id || s.id === id || s.invoiceNo === id || s.serviceNo === id);
  return found ? { ...found, id: found._id || found.id } : null;
}

export async function createServiceRecord(data) {
  const cleanData = {
    ...data,
    vehicleNo: data.vehicleNo.trim().toUpperCase(),
    invoiceNo: data.invoiceNo || `INV-N${Math.floor(8000 + Math.random() * 1999)}`,
    serviceDate: data.serviceDate || new Date().toISOString().split('T')[0],
    serviceTime: data.serviceTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    meterReading: Number(data.meterReading) || 0,
    partsTotal: Number(data.partsTotal) || 0,
    jobTotal: Number(data.jobTotal) || 0,
    totalAmount: Number(data.totalAmount) || 0,
    discountPercent: Number(data.discountPercent) || 0,
    totalDis: Number(data.totalDis) || 0,
    grandTotal: Number(data.grandTotal) || 0,
    billTotal: Number(data.billTotal) || Number(data.grandTotal) || 0,
    nextServiceMeter: Number(data.nextServiceMeter) || (Number(data.meterReading) + 5000)
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await ServiceRecord.create(cleanData);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for createServiceRecord:', err.message);
  }

  const list = getMockServices();
  const uid = generateUniqueId('srv');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  list.unshift(newObj);
  return newObj;
}

export async function updateServiceRecord(id, data) {
  const cleanData = { ...data };
  if (cleanData.vehicleNo) cleanData.vehicleNo = cleanData.vehicleNo.trim().toUpperCase();
  if (cleanData.partsTotal !== undefined) cleanData.partsTotal = Number(cleanData.partsTotal) || 0;
  if (cleanData.jobTotal !== undefined) cleanData.jobTotal = Number(cleanData.jobTotal) || 0;
  if (cleanData.totalAmount !== undefined) cleanData.totalAmount = Number(cleanData.totalAmount) || 0;
  if (cleanData.grandTotal !== undefined) cleanData.grandTotal = Number(cleanData.grandTotal) || 0;
  if (cleanData.billTotal !== undefined) cleanData.billTotal = Number(cleanData.billTotal) || Number(cleanData.grandTotal) || 0;

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await ServiceRecord.findByIdAndUpdate(id, cleanData, { new: true }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for updateServiceRecord:', err.message);
  }

  const list = getMockServices();
  const idx = list.findIndex(s => s._id === id || s.id === id || s.invoiceNo === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
    return list[idx];
  }
  return null;
}

export async function deleteServiceRecord(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ServiceRecord.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteServiceRecord:', err.message);
  }

  const list = getMockServices();
  const idx = list.findIndex(s => s._id === id || s.id === id || s.invoiceNo === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

// === JOBS / SERVICES MASTER CATALOG ===
export async function getJobs() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const docs = await Job.find().sort({ jobName: 1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getJobs:', err.message);
  }
  return getMockJobs().map(j => ({ ...j, id: j._id || j.id }));
}

export async function createJob(data) {
  const cleanData = {
    ...data,
    jobCode: (data.jobCode || `JOB-${String(Date.now()).slice(-4)}`).trim().toUpperCase(),
    jobName: data.jobName.trim(),
    standardLaborFee: Number(data.standardLaborFee) || 0,
    defaultChecklist: Array.isArray(data.defaultChecklist) ? data.defaultChecklist : []
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Job.create(cleanData);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for createJob:', err.message);
  }

  const list = getMockJobs();
  const uid = generateUniqueId('job');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  list.unshift(newObj);
  return newObj;
}

export async function updateJob(id, data) {
  if (data.jobCode) data.jobCode = data.jobCode.trim().toUpperCase();
  if (data.standardLaborFee !== undefined) data.standardLaborFee = Number(data.standardLaborFee) || 0;

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Job.findByIdAndUpdate(id, data, { new: true }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for updateJob:', err.message);
  }

  const list = getMockJobs();
  const idx = list.findIndex(j => j._id === id || j.id === id || j.jobCode === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...data };
    return list[idx];
  }
  return null;
}

export async function deleteJob(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await Job.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteJob:', err.message);
  }

  const list = getMockJobs();
  const idx = list.findIndex(j => j._id === id || j.id === id || j.jobCode === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

// === SUPPLIERS ===
export async function getSuppliers() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const docs = await Supplier.find().sort({ supplierName: 1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getSuppliers:', err.message);
  }
  return getMockSuppliers().map(s => ({ ...s, id: s._id || s.id }));
}

export async function createSupplier(data) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Supplier.create(data);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for createSupplier:', err.message);
  }

  const list = getMockSuppliers();
  const uid = generateUniqueId('sup');
  const newObj = {
    _id: uid,
    id: uid,
    ...data,
    createdAt: new Date().toISOString()
  };
  list.push(newObj);
  return newObj;
}

export async function updateSupplier(id, data) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const { _id, id: sid, ...cleanData } = data;
      let oldSupplier = null;
      if (mongoose.isValidObjectId(id)) {
        oldSupplier = await Supplier.findById(id).lean();
      }
      if (!oldSupplier) {
        oldSupplier = await Supplier.findOne({ $or: [{ _id: id }, { id: id }, { supplierName: id }] }).lean();
      }

      let doc = null;
      if (oldSupplier) {
        doc = await Supplier.findByIdAndUpdate(oldSupplier._id, cleanData, { new: true }).lean();
      } else if (mongoose.isValidObjectId(id)) {
        doc = await Supplier.findByIdAndUpdate(id, cleanData, { new: true }).lean();
      }

      if (doc) {
        // Cascade supplier name change to Item and SupplierInvoice collections
        if (oldSupplier && oldSupplier.supplierName && cleanData.supplierName && oldSupplier.supplierName !== cleanData.supplierName) {
          try {
            await Item.updateMany({ supplierName: oldSupplier.supplierName }, { supplierName: cleanData.supplierName });
            await SupplierInvoice.updateMany({ supplierName: oldSupplier.supplierName }, { supplierName: cleanData.supplierName });
          } catch (cascadeErr) {
            console.warn('Could not cascade supplier name update:', cascadeErr.message);
          }
        }
        return { ...doc, id: doc._id.toString() };
      }
    }
  } catch (err) {
    console.warn('Fallback to memory for updateSupplier:', err.message);
  }

  const list = getMockSuppliers();
  const idx = list.findIndex(s => s._id === id || s.id === id || s.supplierName === id);
  if (idx !== -1) {
    const { _id, id: sid, ...cleanData } = data;
    list[idx] = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
    return list[idx];
  }
  return null;
}

export async function deleteSupplier(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await Supplier.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteSupplier:', err.message);
  }

  const list = getMockSuppliers();
  const idx = list.findIndex(s => s._id === id || s.id === id || s.supplierName === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

// Helper: Calculate Due Date & Overdue Status dynamically
function calculateOverdueMetrics(inv) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(inv.dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status = 'ONGOING';
  let daysToDue = diffDays;
  let daysOverdue = 0;
  let reminderStatus = '';

  if (Number(inv.balance) <= 0) {
    status = 'PAID';
    daysToDue = 0;
  } else if (diffDays < 0) {
    status = 'OVERDUE';
    daysOverdue = Math.abs(diffDays);
    reminderStatus = 'URGENT';
  } else if (diffDays === 0) {
    status = 'ONGOING';
    reminderStatus = 'DUE TODAY';
  }

  return {
    ...inv,
    status,
    daysToDue,
    daysOverdue,
    reminderStatus: inv.reminderStatus || reminderStatus
  };
}

// === SUPPLIER INVOICES & PAYMENT TRACKER ===
export async function getSupplierInvoices() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const docs = await SupplierInvoice.find().sort({ dueDate: 1 }).lean();
      return docs.map(d => calculateOverdueMetrics({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getSupplierInvoices:', err.message);
  }
  return getMockSupplierInvoices().map(inv => calculateOverdueMetrics({ ...inv, id: inv._id || inv.id }));
}

export async function createSupplierInvoice(data) {
  let dueDate = data.dueDate;
  if (!dueDate || !dueDate.trim()) {
    const invDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();
    invDate.setDate(invDate.getDate() + Number(data.creditDays || 0));
    dueDate = invDate.toISOString().split('T')[0];
  }

  const invoiceAmount = Number(data.invoiceAmount) || 0;
  const amountPaid = Number(data.amountPaid) || 0;
  const balance = Math.max(0, invoiceAmount - amountPaid);

  const cleanItems = (Array.isArray(data.items) ? data.items : [])
    .filter(it => it && (it.description?.trim() || it.itemCode?.trim() || Number(it.total) > 0 || Number(it.unitPrice) > 0))
    .map(it => ({
      itemCode: (it.itemCode || '').trim(),
      description: (it.description || it.itemCode || 'Invoice Item').trim(),
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice) || 0,
      total: Number(it.total) || (Number(it.quantity || 1) * Number(it.unitPrice || 0))
    }));

  const { _id, id: sid, ...restData } = data;

  const cleanData = {
    ...restData,
    invoiceId: (data.invoiceId || `INV-${String(Date.now()).slice(-4)}`).trim(),
    supplierName: (data.supplierName || '').trim(),
    invoiceNo: (data.invoiceNo || '').trim(),
    poGrnNo: (data.poGrnNo || '').trim(),
    receivedDate: data.receivedDate || data.invoiceDate || new Date().toISOString().split('T')[0],
    invoiceDate: data.invoiceDate || new Date().toISOString().split('T')[0],
    creditDays: data.creditDays !== undefined && data.creditDays !== '' ? Number(data.creditDays) : 30,
    invoiceAmount,
    amountPaid,
    balance,
    dueDate,
    status: balance <= 0 ? 'PAID' : (new Date(dueDate) < new Date() ? 'OVERDUE' : 'ONGOING'),
    items: cleanItems,
    payments: Array.isArray(data.payments) ? data.payments : [],
    notes: (data.notes || '').trim()
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await SupplierInvoice.create(cleanData);
      return calculateOverdueMetrics({ ...doc.toObject(), id: doc._id.toString() });
    }
  } catch (err) {
    console.warn('Fallback to memory for createSupplierInvoice:', err.message);
  }

  const list = getMockSupplierInvoices();
  const uid = generateUniqueId('sinv');
  const newObj = calculateOverdueMetrics({
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  });
  list.unshift(newObj);
  return newObj;
}

export async function recordSupplierPayment(invoiceId, paymentData) {
  const amount = Number(paymentData.amount) || 0;

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const inv = await SupplierInvoice.findOne({ $or: [{ _id: invoiceId }, { invoiceId: invoiceId }] });
      if (inv) {
        const newPaid = Number(inv.amountPaid || 0) + amount;
        const newBalance = Math.max(0, Number(inv.invoiceAmount || 0) - newPaid);
        inv.amountPaid = newPaid;
        inv.balance = newBalance;
        inv.status = newBalance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
        inv.payments.push({
          paymentId: paymentData.paymentId || `P${Math.floor(190 + Math.random() * 50)}`,
          paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
          amount,
          method: paymentData.method || 'Cheque',
          chequeNo: paymentData.chequeNo || '',
          chequeIssueDate: paymentData.chequeIssueDate || paymentData.paymentDate || '',
          chequeStatus: paymentData.chequeStatus || 'Issued',
          clearedDate: paymentData.clearedDate || '',
          bankAccount: paymentData.bankAccount || '',
          notes: paymentData.notes || ''
        });
        await inv.save();
        return calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() });
      }
    }
  } catch (err) {
    console.warn('Fallback to memory for recordSupplierPayment:', err.message);
  }

  const list = getMockSupplierInvoices();
  const found = list.find(i => i._id === invoiceId || i.id === invoiceId || i.invoiceId === invoiceId);
  if (found) {
    found.amountPaid = Number(found.amountPaid || 0) + amount;
    found.balance = Math.max(0, Number(found.invoiceAmount || 0) - found.amountPaid);
    found.payments = found.payments || [];
    found.payments.push({
      paymentId: paymentData.paymentId || `P${Math.floor(190 + Math.random() * 50)}`,
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      amount,
      method: paymentData.method || 'Cheque',
      chequeNo: paymentData.chequeNo || '',
      chequeIssueDate: paymentData.chequeIssueDate || paymentData.paymentDate || '',
      chequeStatus: paymentData.chequeStatus || 'Issued',
      clearedDate: paymentData.clearedDate || '',
      bankAccount: paymentData.bankAccount || '',
      notes: paymentData.notes || ''
    });
    return calculateOverdueMetrics(found);
  }
  return null;
}

export async function updateSupplierInvoice(id, data) {
  const { _id, id: sid, ...cleanData } = data;
  if (cleanData.invoiceAmount !== undefined || cleanData.amountPaid !== undefined) {
    const invAmount = Number(cleanData.invoiceAmount !== undefined ? cleanData.invoiceAmount : 0);
    const paid = Number(cleanData.amountPaid !== undefined ? cleanData.amountPaid : 0);
    cleanData.balance = Math.max(0, invAmount - paid);
    cleanData.status = cleanData.balance <= 0 ? 'PAID' : (new Date(cleanData.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
  }

  if (Array.isArray(cleanData.items)) {
    cleanData.items = cleanData.items
      .filter(it => it && (it.description?.trim() || it.itemCode?.trim() || Number(it.total) > 0))
      .map(it => ({
        itemCode: (it.itemCode || '').trim(),
        description: (it.description || it.itemCode || 'Invoice Item').trim(),
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        total: Number(it.total) || (Number(it.quantity || 1) * Number(it.unitPrice || 0))
      }));
  }

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      let doc = null;
      if (mongoose.isValidObjectId(id)) {
        doc = await SupplierInvoice.findByIdAndUpdate(id, cleanData, { new: true }).lean();
      }
      if (!doc) {
        doc = await SupplierInvoice.findOneAndUpdate({ invoiceId: id }, cleanData, { new: true }).lean();
      }
      if (doc) return calculateOverdueMetrics({ ...doc, id: doc._id.toString() });
    }
  } catch (err) {
    console.warn('Fallback to memory for updateSupplierInvoice:', err.message);
  }

  const list = getMockSupplierInvoices();
  const idx = list.findIndex(i => i._id === id || i.id === id || i.invoiceId === id);
  if (idx !== -1) {
    list[idx] = calculateOverdueMetrics({ ...list[idx], ...cleanData, updatedAt: new Date().toISOString() });
    return list[idx];
  }
  return null;
}

export async function deleteSupplierInvoice(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (mongoose.isValidObjectId(id)) {
        await SupplierInvoice.findByIdAndDelete(id);
      } else {
        await SupplierInvoice.findOneAndDelete({ invoiceId: id });
      }
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteSupplierInvoice:', err.message);
  }

  const list = getMockSupplierInvoices();
  const idx = list.findIndex(i => i._id === id || i.id === id || i.invoiceId === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

export async function updateSupplierPayment(invoiceId, paymentId, paymentData) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const inv = await SupplierInvoice.findOne({ $or: [{ _id: invoiceId }, { invoiceId: invoiceId }] });
      if (inv) {
        const pIndex = inv.payments.findIndex(p => p.paymentId === paymentId);
        if (pIndex !== -1) {
          inv.payments[pIndex] = { ...inv.payments[pIndex].toObject(), ...paymentData };
          const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
          inv.amountPaid = totalPaid;
          inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
          inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
          await inv.save();
          return calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() });
        }
      }
    }
  } catch (err) {
    console.warn('Fallback to memory for updateSupplierPayment:', err.message);
  }

  const list = getMockSupplierInvoices();
  const inv = list.find(i => i._id === invoiceId || i.id === invoiceId || i.invoiceId === invoiceId);
  if (inv && inv.payments) {
    const pIdx = inv.payments.findIndex(p => p.paymentId === paymentId);
    if (pIdx !== -1) {
      inv.payments[pIdx] = { ...inv.payments[pIdx], ...paymentData };
      const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      inv.amountPaid = totalPaid;
      inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
      inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
      return calculateOverdueMetrics(inv);
    }
  }
  return null;
}

export async function deleteSupplierPayment(invoiceId, paymentId) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const inv = await SupplierInvoice.findOne({ $or: [{ _id: invoiceId }, { invoiceId: invoiceId }] });
      if (inv) {
        inv.payments = inv.payments.filter(p => p.paymentId !== paymentId);
        const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        inv.amountPaid = totalPaid;
        inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
        inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
        await inv.save();
        return calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() });
      }
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteSupplierPayment:', err.message);
  }

  const list = getMockSupplierInvoices();
  const inv = list.find(i => i._id === invoiceId || i.id === invoiceId || i.invoiceId === invoiceId);
  if (inv && inv.payments) {
    inv.payments = inv.payments.filter(p => p.paymentId !== paymentId);
    const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    inv.amountPaid = totalPaid;
    inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
    inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
    return calculateOverdueMetrics(inv);
  }
  return null;
}

// === GENERAL OPERATING EXPENSES ===
export async function getExpenses() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const docs = await Expense.find().sort({ expenseDate: -1, createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d._id.toString() }));
    }
  } catch (err) {
    console.warn('Fallback to memory for getExpenses:', err.message);
  }
  return getMockExpenses().map(e => ({ ...e, id: e._id || e.id }));
}

export async function createExpense(data) {
  const cleanData = {
    ...data,
    expenseNo: data.expenseNo || `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
    amount: Number(data.amount) || 0
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Expense.create(cleanData);
      return { ...doc.toObject(), id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for createExpense:', err.message);
  }

  const list = getMockExpenses();
  const uid = generateUniqueId('exp');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  list.unshift(newObj);
  return newObj;
}

export async function deleteExpense(id) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await Expense.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn('Fallback to memory for deleteExpense:', err.message);
  }

  const list = getMockExpenses();
  const idx = list.findIndex(e => e._id === id || e.id === id || e.expenseNo === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

export async function updateExpense(id, data) {
  if (data.amount !== undefined) data.amount = Number(data.amount);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const doc = await Expense.findByIdAndUpdate(id, data, { new: true }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Fallback to memory for updateExpense:', err.message);
  }

  const list = getMockExpenses();
  const idx = list.findIndex(e => e._id === id || e.id === id || e.expenseNo === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
    return list[idx];
  }
  return null;
}

// === DYNAMIC FINANCIAL ANALYTICS (REVENUE, SHOULD PAY TODAY, EXPENSES) ===
export async function getFinancialAnalytics() {
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch all live records
  const [services, invoices, expenses] = await Promise.all([
    getServicesByVehicleNo(),
    getSupplierInvoices(),
    getExpenses()
  ]);

  // 1. REVENUE CALCULATIONS
  let totalRevenue = 0;
  let revenueToday = 0;
  let revenueThisMonth = 0;
  const currentMonthPrefix = todayStr.slice(0, 7); // e.g. "2026-11"

  services.forEach(srv => {
    const amt = Number(srv.billTotal || srv.grandTotal || srv.totalAmount) || 0;
    totalRevenue += amt;
    if (srv.serviceDate === todayStr) {
      revenueToday += amt;
    }
    if (srv.serviceDate && srv.serviceDate.startsWith(currentMonthPrefix)) {
      revenueThisMonth += amt;
    }
  });

  // 2. EXPENSES & SHOULD PAY TODAY CALCULATIONS
  let supplierPayablesTotal = 0;
  let expensesShouldPayToday = 0;
  let paymentsRequiringAttentionToday = [];

  invoices.forEach(inv => {
    const bal = Number(inv.balance) || 0;
    if (bal > 0) {
      supplierPayablesTotal += bal;
      const isOverdue = inv.status === 'OVERDUE' || (inv.dueDate && inv.dueDate < todayStr);
      const isDueToday = inv.dueDate === todayStr;

      if (isOverdue || isDueToday) {
        expensesShouldPayToday += bal;
        paymentsRequiringAttentionToday.push({
          ...inv,
          attentionReason: isDueToday ? 'DUE TODAY' : 'OVERDUE'
        });
      }
    }
  });

  // Also check pending operating expenses due today
  let operatingExpensesPaidTotal = 0;
  let operatingExpensesPaidToday = 0;

  expenses.forEach(exp => {
    const amt = Number(exp.amount) || 0;
    if (exp.status === 'Paid') {
      operatingExpensesPaidTotal += amt;
      if (exp.expenseDate === todayStr) {
        operatingExpensesPaidToday += amt;
      }
    } else if (exp.status === 'Should Pay Today' || exp.dueDate === todayStr || (exp.dueDate && exp.dueDate < todayStr)) {
      expensesShouldPayToday += amt;
    }
  });

  // Total Supplier Payments already cleared
  let supplierPaymentsMadeTotal = 0;
  let supplierPaymentsMadeToday = 0;

  invoices.forEach(inv => {
    if (Array.isArray(inv.payments)) {
      inv.payments.forEach(p => {
        const pAmt = Number(p.amount) || 0;
        supplierPaymentsMadeTotal += pAmt;
        if (p.paymentDate === todayStr) {
          supplierPaymentsMadeToday += pAmt;
        }
      });
    }
  });

  const totalExpensesPaid = supplierPaymentsMadeTotal + operatingExpensesPaidTotal;
  const expensesPaidToday = supplierPaymentsMadeToday + operatingExpensesPaidToday;
  const netOperatingProfit = totalRevenue - totalExpensesPaid;

  // Sort attention reminders: Overdue first, then largest balance
  paymentsRequiringAttentionToday.sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0));

  return {
    todayStr,
    totalRevenue,
    revenueToday,
    revenueThisMonth,
    expensesShouldPayToday,
    supplierPayablesTotal,
    totalExpensesPaid,
    expensesPaidToday,
    netOperatingProfit,
    paymentsRequiringAttentionToday,
    recentServicesCount: services.length,
    activeSuppliersCount: (await getSuppliers()).length
  };
}
