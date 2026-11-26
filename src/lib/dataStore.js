import mongoose from 'mongoose';
import { connectToDatabase, isDbConnected } from './mongodb';
import Vehicle from '@/models/Vehicle';
import Item from '@/models/Item';
import ServiceRecord from '@/models/ServiceRecord';
import Supplier from '@/models/Supplier';
import SupplierInvoice from '@/models/SupplierInvoice';
import SupplierReturn from '@/models/SupplierReturn';
import Expense from '@/models/Expense';
import Job from '@/models/Job';
import {
  getSnapshot,
  setSnapshot,
  mutateSnapshot,
  enqueueOfflineOp,
  getOfflineQueue,
  removeQueueItemById,
  resolveOfflineId,
  setIdMapping,
  markSyncSuccess,
  markSyncError,
  getOfflineSyncStatus
} from './offlineStore';

let idCounter = 0;
export function generateUniqueId(prefix = 'id') {
  idCounter = (idCounter + 1) % 100000;
  return `${prefix}_${Date.now()}_${idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

function stripIds(data) {
  if (!data || typeof data !== 'object') return {};
  const { _id, id, ...rest } = data;
  return rest;
}

function upsertSnapshotItem(collection, doc, atStart = true) {
  const docId = doc.id || (doc._id ? doc._id.toString() : '');
  mutateSnapshot(collection, (list) => {
    const idx = list.findIndex(x => (x.id || x._id) === docId);
    if (idx !== -1) {
      const copy = [...list];
      copy[idx] = doc;
      return copy;
    }
    return atStart ? [doc, ...list] : [...list, doc];
  });
}

function removeSnapshotItem(collection, id, extraMatcher = null) {
  const resolved = resolveOfflineId(id);
  mutateSnapshot(collection, (list) =>
    list.filter(x => {
      const xId = x.id || x._id;
      if (xId === id || xId === resolved) return false;
      if (extraMatcher && extraMatcher(x, id, resolved)) return false;
      return true;
    })
  );
}

async function ensureSyncedBeforeOp() {
  if (getOfflineQueue().length > 0 && isDbConnected()) {
    await syncOfflineQueue({ refreshSnapshot: false });
  }
}

// === VEHICLES ===
export async function getVehicles() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      const docs = await Vehicle.find().sort({ createdAt: -1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      setSnapshot('vehicles', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getVehicles:', err.message);
  }
  return getSnapshot('vehicles').map(v => ({ ...v, id: v._id || v.id }));
}

export async function createVehicle(data, { fromSync = false } = {}) {
  const cleanData = {
    ...stripIds(data),
    vehicleNo: data.vehicleNo.trim().toUpperCase(),
    rNo: data.rNo || `R-${String(Date.now()).slice(-3)}`
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc;
      try {
        doc = await Vehicle.create(cleanData);
      } catch (createErr) {
        if (fromSync && createErr?.code === 11000) {
          doc = await Vehicle.findOneAndUpdate({ vehicleNo: cleanData.vehicleNo }, cleanData, { new: true });
        } else {
          throw createErr;
        }
      }
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('vehicles', created, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createVehicle:', err.message);
  }

  const uid = generateUniqueId('veh');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  upsertSnapshotItem('vehicles', newObj, true);
  enqueueOfflineOp('createVehicle', [cleanData], uid);
  return newObj;
}

export async function updateVehicle(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  if (cleanData.vehicleNo) cleanData.vehicleNo = cleanData.vehicleNo.trim().toUpperCase();
  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await Vehicle.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      if (doc) {
        const updated = { ...doc, id: doc._id.toString() };
        upsertSnapshotItem('vehicles', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateVehicle:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('vehicles', (list) => {
    const idx = list.findIndex(v => v._id === id || v.id === id || v._id === targetId || v.id === targetId || v.vehicleNo === id);
    if (idx !== -1) {
      updatedObj = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateVehicle', [id, cleanData]);
  }
  return updatedObj;
}

export async function deleteVehicle(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await Vehicle.findByIdAndDelete(targetId);
      removeSnapshotItem('vehicles', id, (v, rawId) => v.vehicleNo === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteVehicle:', err.message);
  }

  const beforeLen = getSnapshot('vehicles').length;
  removeSnapshotItem('vehicles', id, (v, rawId) => v.vehicleNo === rawId);
  const removed = getSnapshot('vehicles').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteVehicle', [id]);
  }
  return removed;
}

// === ITEMS ===
export async function getItems() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      const docs = await Item.find().sort({ updatedAt: -1, createdAt: -1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      setSnapshot('items', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getItems:', err.message);
  }
  return getSnapshot('items')
    .map(i => ({ ...i, id: i._id || i.id }))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

export async function createItem(data, { fromSync = false } = {}) {
  const cleanData = {
    itemCode: (data.itemCode || `ITM-${String(Date.now()).slice(-4)}`).trim().toUpperCase(),
    barcode: (data.barcode || '').trim(),
    description: (data.description || '').trim(),
    supplierName: (data.supplierName || '').trim(),
    category: (data.category || 'General').trim(),
    qtyOnHand: Number(data.qtyOnHand) || 0,
    stockUnit: (data.stockUnit || 'Units').trim(),
    costPrice: Number(data.costPrice) || 0,
    sellingPrice: Number(data.sellingPrice) || 0,
    stockDate: (data.stockDate || '').trim(),
    stockTime: (data.stockTime || '').trim(),
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc;
      try {
        doc = await Item.create(cleanData);
      } catch (createErr) {
        if (createErr?.code === 11000) {
          await Item.collection.dropIndex('itemCode_1').catch(() => {});
          doc = await Item.create(cleanData);
        } else {
          throw createErr;
        }
      }
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('items', created, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createItem:', err.message);
  }

  const uid = generateUniqueId('itm');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  upsertSnapshotItem('items', newObj, true);
  enqueueOfflineOp('createItem', [cleanData], uid);
  return newObj;
}

export async function updateItem(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  if (cleanData.itemCode) cleanData.itemCode = cleanData.itemCode.trim().toUpperCase();
  if (cleanData.qtyOnHand !== undefined) cleanData.qtyOnHand = Number(cleanData.qtyOnHand);
  if (cleanData.costPrice !== undefined) cleanData.costPrice = Number(cleanData.costPrice);
  if (cleanData.sellingPrice !== undefined) cleanData.sellingPrice = Number(cleanData.sellingPrice);
  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await Item.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      if (doc) {
        const updated = { ...doc, id: doc._id.toString() };
        upsertSnapshotItem('items', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateItem:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('items', (list) => {
    const idx = list.findIndex(i => i._id === id || i.id === id || i._id === targetId || i.id === targetId || i.itemCode === id);
    if (idx !== -1) {
      updatedObj = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateItem', [id, cleanData]);
  }
  return updatedObj;
}

export async function deleteItem(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await Item.findByIdAndDelete(targetId);
      removeSnapshotItem('items', id, (i, rawId) => i.itemCode === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteItem:', err.message);
  }

  const beforeLen = getSnapshot('items').length;
  removeSnapshotItem('items', id, (i, rawId) => i.itemCode === rawId);
  const removed = getSnapshot('items').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteItem', [id]);
  }
  return removed;
}

// === SERVICES / REVENUE ===
export async function getServicesByVehicleNo(vehicleNo) {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      let query = {};
      if (vehicleNo) {
        query.vehicleNo = vehicleNo.trim().toUpperCase();
      }
      const docs = await ServiceRecord.find(query).sort({ serviceDate: -1, createdAt: -1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      if (!vehicleNo) {
        setSnapshot('services', result);
      }
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getServices:', err.message);
  }

  let list = getSnapshot('services');
  if (vehicleNo) {
    const vNo = vehicleNo.trim().toUpperCase();
    list = list.filter(s => (s.vehicleNo || '').toUpperCase() === vNo);
  }
  list = [...list].sort((a, b) => new Date(b.serviceDate || 0) - new Date(a.serviceDate || 0));
  return list.map(s => ({ ...s, id: s._id || s.id }));
}

export async function getServiceRecordById(id) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        doc = await ServiceRecord.findById(targetId).lean();
      }
      if (!doc) {
        doc = await ServiceRecord.findOne({
          $or: [{ invoiceNo: id }, { serviceNo: id }]
        }).lean();
      }
      if (doc) return { ...doc, id: doc._id.toString() };
    }
  } catch (err) {
    console.warn('Offline cache used for getServiceRecordById:', err.message);
  }

  const list = getSnapshot('services');
  const found = list.find(s => s._id === id || s.id === id || s._id === targetId || s.id === targetId || s.invoiceNo === id || s.serviceNo === id);
  return found ? { ...found, id: found._id || found.id } : null;
}

async function deductStockForServiceParts(parts, isOnline) {
  if (!Array.isArray(parts) || parts.length === 0) return;

  for (const part of parts) {
    const usedQty = Number(part.quantity || part.qty) || 0;
    if (usedQty <= 0) continue;
    const rawItemId = part.itemId ? resolveOfflineId(part.itemId) : '';
    const code = (part.code || '').trim().toUpperCase();
    const supplierName = (part.supplierName || part.supplier || '').trim();

    if (isOnline) {
      let doc = null;
      if (rawItemId && mongoose.isValidObjectId(rawItemId)) {
        doc = await Item.findById(rawItemId);
      }
      if (!doc && code) {
        if (supplierName && supplierName !== 'General') {
          doc = await Item.findOne({ itemCode: code, supplierName });
        }
        if (!doc) {
          doc = await Item.findOne({ itemCode: code });
        }
      }
      if (doc) {
        doc.qtyOnHand = Math.max(0, (Number(doc.qtyOnHand) || 0) - usedQty);
        await doc.save();
        upsertSnapshotItem('items', { ...doc.toObject(), id: doc._id.toString() }, false);
      }
    } else {
      mutateSnapshot('items', (list) => {
        let idx = -1;
        if (rawItemId) {
          idx = list.findIndex(i => i._id === rawItemId || i.id === rawItemId || i._id === part.itemId || i.id === part.itemId);
        }
        if (idx === -1 && code) {
          if (supplierName && supplierName !== 'General') {
            idx = list.findIndex(i => (i.itemCode || '').toUpperCase() === code && (i.supplierName || '') === supplierName);
          }
          if (idx === -1) {
            idx = list.findIndex(i => (i.itemCode || '').toUpperCase() === code);
          }
        }
        if (idx !== -1) {
          const copy = [...list];
          copy[idx] = {
            ...copy[idx],
            qtyOnHand: Math.max(0, (Number(copy[idx].qtyOnHand) || 0) - usedQty),
            updatedAt: new Date().toISOString()
          };
          return copy;
        }
        return list;
      });
    }
  }
}

export async function createServiceRecord(data, { fromSync = false } = {}) {
  const generatedNo = data.invoiceNo || data.serviceNo || `INV-N${Math.floor(8000 + Math.random() * 1999)}`;
  const cleanData = {
    ...stripIds(data),
    vehicleNo: data.vehicleNo.trim().toUpperCase(),
    invoiceNo: generatedNo,
    serviceNo: data.serviceNo || generatedNo,
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
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc;
      try {
        doc = await ServiceRecord.create(cleanData);
      } catch (createErr) {
        if (fromSync && createErr?.code === 11000 && cleanData.invoiceNo) {
          doc = await ServiceRecord.findOneAndUpdate({ invoiceNo: cleanData.invoiceNo }, cleanData, { new: true });
        } else {
          throw createErr;
        }
      }
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('services', created, true);
      await deductStockForServiceParts(cleanData.parts, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createServiceRecord:', err.message);
  }

  const uid = generateUniqueId('srv');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  upsertSnapshotItem('services', newObj, true);
  await deductStockForServiceParts(cleanData.parts, false);
  enqueueOfflineOp('createServiceRecord', [cleanData], uid);
  return newObj;
}

export async function updateServiceRecord(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  if (cleanData.vehicleNo) cleanData.vehicleNo = cleanData.vehicleNo.trim().toUpperCase();
  if (cleanData.partsTotal !== undefined) cleanData.partsTotal = Number(cleanData.partsTotal) || 0;
  if (cleanData.jobTotal !== undefined) cleanData.jobTotal = Number(cleanData.jobTotal) || 0;
  if (cleanData.totalAmount !== undefined) cleanData.totalAmount = Number(cleanData.totalAmount) || 0;
  if (cleanData.grandTotal !== undefined) cleanData.grandTotal = Number(cleanData.grandTotal) || 0;
  if (cleanData.billTotal !== undefined) cleanData.billTotal = Number(cleanData.billTotal) || Number(cleanData.grandTotal) || 0;
  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await ServiceRecord.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      if (doc) {
        const updated = { ...doc, id: doc._id.toString() };
        upsertSnapshotItem('services', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateServiceRecord:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('services', (list) => {
    const idx = list.findIndex(s => s._id === id || s.id === id || s._id === targetId || s.id === targetId || s.invoiceNo === id);
    if (idx !== -1) {
      updatedObj = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateServiceRecord', [id, cleanData]);
  }
  return updatedObj;
}

export async function deleteServiceRecord(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await ServiceRecord.findByIdAndDelete(targetId);
      removeSnapshotItem('services', id, (s, rawId) => s.invoiceNo === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteServiceRecord:', err.message);
  }

  const beforeLen = getSnapshot('services').length;
  removeSnapshotItem('services', id, (s, rawId) => s.invoiceNo === rawId);
  const removed = getSnapshot('services').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteServiceRecord', [id]);
  }
  return removed;
}

// === JOBS / SERVICES MASTER CATALOG ===
export async function getJobs() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      const docs = await Job.find().sort({ jobName: 1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      setSnapshot('jobs', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getJobs:', err.message);
  }
  return getSnapshot('jobs').map(j => ({ ...j, id: j._id || j.id }));
}

export async function createJob(data, { fromSync = false } = {}) {
  const cleanData = {
    ...stripIds(data),
    jobCode: (data.jobCode || `JOB-${String(Date.now()).slice(-4)}`).trim().toUpperCase(),
    jobName: data.jobName.trim(),
    standardLaborFee: Number(data.standardLaborFee) || 0,
    defaultChecklist: Array.isArray(data.defaultChecklist) ? data.defaultChecklist : []
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc;
      try {
        doc = await Job.create(cleanData);
      } catch (createErr) {
        if (fromSync && createErr?.code === 11000 && cleanData.jobCode) {
          doc = await Job.findOneAndUpdate({ jobCode: cleanData.jobCode }, cleanData, { new: true });
        } else {
          throw createErr;
        }
      }
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('jobs', created, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createJob:', err.message);
  }

  const uid = generateUniqueId('job');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  upsertSnapshotItem('jobs', newObj, true);
  enqueueOfflineOp('createJob', [cleanData], uid);
  return newObj;
}

export async function updateJob(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  if (cleanData.jobCode) cleanData.jobCode = cleanData.jobCode.trim().toUpperCase();
  if (cleanData.standardLaborFee !== undefined) cleanData.standardLaborFee = Number(cleanData.standardLaborFee) || 0;
  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await Job.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      if (doc) {
        const updated = { ...doc, id: doc._id.toString() };
        upsertSnapshotItem('jobs', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateJob:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('jobs', (list) => {
    const idx = list.findIndex(j => j._id === id || j.id === id || j._id === targetId || j.id === targetId || j.jobCode === id);
    if (idx !== -1) {
      updatedObj = { ...list[idx], ...cleanData };
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateJob', [id, cleanData]);
  }
  return updatedObj;
}

export async function deleteJob(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await Job.findByIdAndDelete(targetId);
      removeSnapshotItem('jobs', id, (j, rawId) => j.jobCode === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteJob:', err.message);
  }

  const beforeLen = getSnapshot('jobs').length;
  removeSnapshotItem('jobs', id, (j, rawId) => j.jobCode === rawId);
  const removed = getSnapshot('jobs').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteJob', [id]);
  }
  return removed;
}

// === SUPPLIERS ===
export async function getSuppliers() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      const docs = await Supplier.find().sort({ supplierName: 1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      setSnapshot('suppliers', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getSuppliers:', err.message);
  }
  return getSnapshot('suppliers').map(s => ({ ...s, id: s._id || s.id }));
}

export async function createSupplier(data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc;
      try {
        doc = await Supplier.create(cleanData);
      } catch (createErr) {
        if (fromSync && createErr?.code === 11000 && cleanData.supplierName) {
          doc = await Supplier.findOneAndUpdate({ supplierName: cleanData.supplierName }, cleanData, { new: true });
        } else {
          throw createErr;
        }
      }
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('suppliers', created, false);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createSupplier:', err.message);
  }

  const uid = generateUniqueId('sup');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  upsertSnapshotItem('suppliers', newObj, false);
  enqueueOfflineOp('createSupplier', [cleanData], uid);
  return newObj;
}

export async function updateSupplier(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      let oldSupplier = null;
      if (mongoose.isValidObjectId(targetId)) {
        oldSupplier = await Supplier.findById(targetId).lean();
      }
      if (!oldSupplier) {
        oldSupplier = await Supplier.findOne({ supplierName: id }).lean();
      }

      let doc = null;
      if (oldSupplier) {
        doc = await Supplier.findByIdAndUpdate(oldSupplier._id, cleanData, { new: true }).lean();
      } else if (mongoose.isValidObjectId(targetId)) {
        doc = await Supplier.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      }

      if (doc) {
        if (oldSupplier && oldSupplier.supplierName && cleanData.supplierName && oldSupplier.supplierName !== cleanData.supplierName) {
          try {
            await Item.updateMany({ supplierName: oldSupplier.supplierName }, { supplierName: cleanData.supplierName });
            await SupplierInvoice.updateMany({ supplierName: oldSupplier.supplierName }, { supplierName: cleanData.supplierName });
          } catch (cascadeErr) {
            console.warn('Could not cascade supplier name update:', cascadeErr.message);
          }
        }
        const updated = { ...doc, id: doc._id.toString() };
        upsertSnapshotItem('suppliers', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateSupplier:', err.message);
  }

  let updatedObj = null;
  let oldName = null;
  mutateSnapshot('suppliers', (list) => {
    const idx = list.findIndex(s => s._id === id || s.id === id || s._id === targetId || s.id === targetId || s.supplierName === id);
    if (idx !== -1) {
      oldName = list[idx].supplierName;
      updatedObj = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    if (oldName && cleanData.supplierName && oldName !== cleanData.supplierName) {
      mutateSnapshot('items', (list) => list.map(it => it.supplierName === oldName ? { ...it, supplierName: cleanData.supplierName } : it));
      mutateSnapshot('supplierInvoices', (list) => list.map(inv => inv.supplierName === oldName ? { ...inv, supplierName: cleanData.supplierName } : inv));
    }
    enqueueOfflineOp('updateSupplier', [id, cleanData]);
  }
  return updatedObj;
}

export async function deleteSupplier(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await Supplier.findByIdAndDelete(targetId);
      removeSnapshotItem('suppliers', id, (s, rawId) => s.supplierName === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteSupplier:', err.message);
  }

  const beforeLen = getSnapshot('suppliers').length;
  removeSnapshotItem('suppliers', id, (s, rawId) => s.supplierName === rawId);
  const removed = getSnapshot('suppliers').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteSupplier', [id]);
  }
  return removed;
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
      await ensureSyncedBeforeOp();
      const docs = await SupplierInvoice.find().sort({ dueDate: 1 }).lean();
      const result = docs.map(d => calculateOverdueMetrics({ ...d, id: d._id.toString() }));
      setSnapshot('supplierInvoices', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getSupplierInvoices:', err.message);
  }
  return getSnapshot('supplierInvoices').map(inv => calculateOverdueMetrics({ ...inv, id: inv._id || inv.id }));
}

export async function createSupplierInvoice(data, { fromSync = false } = {}) {
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

  const restData = stripIds(data);

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
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc;
      try {
        doc = await SupplierInvoice.create(cleanData);
      } catch (createErr) {
        if (fromSync && createErr?.code === 11000 && cleanData.invoiceId) {
          doc = await SupplierInvoice.findOneAndUpdate({ invoiceId: cleanData.invoiceId }, cleanData, { new: true });
        } else {
          throw createErr;
        }
      }
      const created = calculateOverdueMetrics({ ...doc.toObject(), id: doc._id.toString() });
      upsertSnapshotItem('supplierInvoices', created, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createSupplierInvoice:', err.message);
  }

  const uid = generateUniqueId('sinv');
  const newObj = calculateOverdueMetrics({
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  });
  upsertSnapshotItem('supplierInvoices', newObj, true);
  enqueueOfflineOp('createSupplierInvoice', [cleanData], uid);
  return newObj;
}

export async function recordSupplierPayment(invoiceId, paymentData, { fromSync = false } = {}) {
  const amount = Number(paymentData.amount) || 0;
  const targetId = resolveOfflineId(invoiceId);
  const paymentPayload = {
    paymentId: paymentData.paymentId || `P${Math.floor(190 + Math.random() * 50)}_${String(Date.now()).slice(-4)}`,
    paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
    amount,
    method: paymentData.method || 'Cheque',
    chequeNo: paymentData.chequeNo || '',
    chequeIssueDate: paymentData.chequeIssueDate || paymentData.paymentDate || '',
    chequeStatus: paymentData.chequeStatus || 'Issued',
    clearedDate: paymentData.clearedDate || '',
    bankAccount: paymentData.bankAccount || '',
    notes: paymentData.notes || ''
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const query = mongoose.isValidObjectId(targetId)
        ? { $or: [{ _id: targetId }, { invoiceId: targetId }] }
        : { invoiceId: targetId };
      const inv = await SupplierInvoice.findOne(query);
      if (inv) {
        const newPaid = Number(inv.amountPaid || 0) + amount;
        const newBalance = Math.max(0, Number(inv.invoiceAmount || 0) - newPaid);
        inv.amountPaid = newPaid;
        inv.balance = newBalance;
        inv.status = newBalance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
        inv.payments.push(paymentPayload);
        await inv.save();
        const updated = calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() });
        upsertSnapshotItem('supplierInvoices', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for recordSupplierPayment:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('supplierInvoices', (list) => {
    const idx = list.findIndex(i => i._id === invoiceId || i.id === invoiceId || i._id === targetId || i.id === targetId || i.invoiceId === invoiceId);
    if (idx !== -1) {
      const found = { ...list[idx] };
      found.amountPaid = Number(found.amountPaid || 0) + amount;
      found.balance = Math.max(0, Number(found.invoiceAmount || 0) - found.amountPaid);
      found.payments = [...(found.payments || []), paymentPayload];
      updatedObj = calculateOverdueMetrics(found);
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('recordSupplierPayment', [invoiceId, paymentPayload]);
  }
  return updatedObj;
}

export async function updateSupplierInvoice(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
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

  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      let doc = null;
      if (mongoose.isValidObjectId(targetId)) {
        doc = await SupplierInvoice.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      }
      if (!doc) {
        doc = await SupplierInvoice.findOneAndUpdate({ invoiceId: targetId }, cleanData, { new: true }).lean();
      }
      if (doc) {
        const updated = calculateOverdueMetrics({ ...doc, id: doc._id.toString() });
        upsertSnapshotItem('supplierInvoices', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateSupplierInvoice:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('supplierInvoices', (list) => {
    const idx = list.findIndex(i => i._id === id || i.id === id || i._id === targetId || i.id === targetId || i.invoiceId === id);
    if (idx !== -1) {
      updatedObj = calculateOverdueMetrics({ ...list[idx], ...cleanData, updatedAt: new Date().toISOString() });
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateSupplierInvoice', [id, cleanData]);
  }
  return updatedObj;
}

export async function deleteSupplierInvoice(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      if (mongoose.isValidObjectId(targetId)) {
        await SupplierInvoice.findByIdAndDelete(targetId);
      } else {
        await SupplierInvoice.findOneAndDelete({ invoiceId: targetId });
      }
      removeSnapshotItem('supplierInvoices', id, (inv, rawId) => inv.invoiceId === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteSupplierInvoice:', err.message);
  }

  const beforeLen = getSnapshot('supplierInvoices').length;
  removeSnapshotItem('supplierInvoices', id, (inv, rawId) => inv.invoiceId === rawId);
  const removed = getSnapshot('supplierInvoices').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteSupplierInvoice', [id]);
  }
  return removed;
}

export async function updateSupplierPayment(invoiceId, paymentId, paymentData, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(invoiceId);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const query = mongoose.isValidObjectId(targetId)
        ? { $or: [{ _id: targetId }, { invoiceId: targetId }] }
        : { invoiceId: targetId };
      const inv = await SupplierInvoice.findOne(query);
      if (inv) {
        const pIndex = inv.payments.findIndex(p => p.paymentId === paymentId);
        if (pIndex !== -1) {
          inv.payments[pIndex] = { ...inv.payments[pIndex].toObject(), ...paymentData };
          const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
          inv.amountPaid = totalPaid;
          inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
          inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
          await inv.save();
          const updated = calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() });
          upsertSnapshotItem('supplierInvoices', updated, false);
          return updated;
        }
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateSupplierPayment:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('supplierInvoices', (list) => {
    const idx = list.findIndex(i => i._id === invoiceId || i.id === invoiceId || i._id === targetId || i.id === targetId || i.invoiceId === invoiceId);
    if (idx !== -1 && list[idx].payments) {
      const inv = { ...list[idx], payments: [...list[idx].payments] };
      const pIdx = inv.payments.findIndex(p => p.paymentId === paymentId);
      if (pIdx !== -1) {
        inv.payments[pIdx] = { ...inv.payments[pIdx], ...paymentData };
        const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        inv.amountPaid = totalPaid;
        inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
        inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
        updatedObj = calculateOverdueMetrics(inv);
        const copy = [...list];
        copy[idx] = updatedObj;
        return copy;
      }
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateSupplierPayment', [invoiceId, paymentId, paymentData]);
  }
  return updatedObj;
}

export async function deleteSupplierPayment(invoiceId, paymentId, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(invoiceId);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const query = mongoose.isValidObjectId(targetId)
        ? { $or: [{ _id: targetId }, { invoiceId: targetId }] }
        : { invoiceId: targetId };
      const inv = await SupplierInvoice.findOne(query);
      if (inv) {
        inv.payments = inv.payments.filter(p => p.paymentId !== paymentId);
        const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        inv.amountPaid = totalPaid;
        inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
        inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
        await inv.save();
        const updated = calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() });
        upsertSnapshotItem('supplierInvoices', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteSupplierPayment:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('supplierInvoices', (list) => {
    const idx = list.findIndex(i => i._id === invoiceId || i.id === invoiceId || i._id === targetId || i.id === targetId || i.invoiceId === invoiceId);
    if (idx !== -1 && list[idx].payments) {
      const inv = { ...list[idx] };
      inv.payments = inv.payments.filter(p => p.paymentId !== paymentId);
      const totalPaid = inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      inv.amountPaid = totalPaid;
      inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
      inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
      updatedObj = calculateOverdueMetrics(inv);
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('deleteSupplierPayment', [invoiceId, paymentId]);
  }
  return updatedObj;
}

// === GENERAL OPERATING EXPENSES ===
export async function getExpenses() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      const docs = await Expense.find().sort({ expenseDate: -1, createdAt: -1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      setSnapshot('expenses', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getExpenses:', err.message);
  }
  return getSnapshot('expenses').map(e => ({ ...e, id: e._id || e.id }));
}

export async function createExpense(data, { fromSync = false } = {}) {
  const cleanData = {
    ...stripIds(data),
    expenseNo: data.expenseNo || `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
    amount: Number(data.amount) || 0
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await Expense.create(cleanData);
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('expenses', created, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createExpense:', err.message);
  }

  const uid = generateUniqueId('exp');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  upsertSnapshotItem('expenses', newObj, true);
  enqueueOfflineOp('createExpense', [cleanData], uid);
  return newObj;
}

export async function deleteExpense(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await Expense.findByIdAndDelete(targetId);
      removeSnapshotItem('expenses', id, (e, rawId) => e.expenseNo === rawId);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteExpense:', err.message);
  }

  const beforeLen = getSnapshot('expenses').length;
  removeSnapshotItem('expenses', id, (e, rawId) => e.expenseNo === rawId);
  const removed = getSnapshot('expenses').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteExpense', [id]);
  }
  return removed;
}

export async function updateExpense(id, data, { fromSync = false } = {}) {
  const cleanData = stripIds(data);
  if (cleanData.amount !== undefined) cleanData.amount = Number(cleanData.amount);
  const targetId = resolveOfflineId(id);

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await Expense.findByIdAndUpdate(targetId, cleanData, { new: true }).lean();
      if (doc) {
        const updated = { ...doc, id: doc._id.toString() };
        upsertSnapshotItem('expenses', updated, false);
        return updated;
      }
      if (fromSync) return null;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for updateExpense:', err.message);
  }

  let updatedObj = null;
  mutateSnapshot('expenses', (list) => {
    const idx = list.findIndex(e => e._id === id || e.id === id || e._id === targetId || e.id === targetId || e.expenseNo === id);
    if (idx !== -1) {
      updatedObj = { ...list[idx], ...cleanData, updatedAt: new Date().toISOString() };
      const copy = [...list];
      copy[idx] = updatedObj;
      return copy;
    }
    return list;
  });
  if (updatedObj) {
    enqueueOfflineOp('updateExpense', [id, cleanData]);
  }
  return updatedObj;
}

// === SUPPLIER ITEM RETURNS ===
export async function getSupplierReturns() {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      await ensureSyncedBeforeOp();
      const docs = await SupplierReturn.find().sort({ returnDate: -1, createdAt: -1 }).lean();
      const result = docs.map(d => ({ ...d, id: d._id.toString() }));
      setSnapshot('supplierReturns', result);
      return result;
    }
  } catch (err) {
    console.warn('Offline cache used for getSupplierReturns:', err.message);
  }
  return getSnapshot('supplierReturns').map(r => ({ ...r, id: r._id || r.id }));
}

async function applySupplierReturnEffects(cleanData, isOnline) {
  const returnQty = Number(cleanData.returnQty) || 0;
  const refundAmount = Number(cleanData.refundAmount) || 0;
  const rawItemId = cleanData.itemId ? resolveOfflineId(cleanData.itemId) : '';
  const code = (cleanData.itemCode || '').trim().toUpperCase();
  const supplierName = (cleanData.supplierName || '').trim();

  // 1. Remove or deduct item from catalog
  if (isOnline) {
    let doc = null;
    if (rawItemId && mongoose.isValidObjectId(rawItemId)) {
      doc = await Item.findById(rawItemId);
    }
    if (!doc && code) {
      doc = supplierName
        ? await Item.findOne({ itemCode: code, supplierName })
        : await Item.findOne({ itemCode: code });
    }
    if (doc) {
      const currentQty = Number(doc.qtyOnHand) || 0;
      if (returnQty >= currentQty || currentQty <= 0) {
        const deletedId = doc._id.toString();
        await Item.findByIdAndDelete(doc._id);
        removeSnapshotItem('items', deletedId);
      } else {
        doc.qtyOnHand = currentQty - returnQty;
        await doc.save();
        upsertSnapshotItem('items', { ...doc.toObject(), id: doc._id.toString() }, false);
      }
    }

    // 2. Adjust unpaid supplier invoice balance if Deduct from Supplier Balance
    if (refundAmount > 0 && cleanData.refundMethod === 'Deduct from Supplier Balance' && supplierName) {
      let remainingCredit = refundAmount;
      const openInvoices = await SupplierInvoice.find({
        supplierName,
        balance: { $gt: 0 }
      }).sort({ dueDate: 1 });

      for (const inv of openInvoices) {
        if (remainingCredit <= 0) break;
        const bal = Number(inv.balance) || 0;
        const creditApplied = Math.min(bal, remainingCredit);
        inv.amountPaid = Number(inv.amountPaid || 0) + creditApplied;
        inv.balance = Math.max(0, bal - creditApplied);
        inv.status = inv.balance <= 0 ? 'PAID' : (new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING');
        inv.payments.push({
          paymentId: `RET-${String(Date.now()).slice(-5)}`,
          paymentDate: cleanData.returnDate,
          amount: creditApplied,
          method: 'Cash',
          notes: `Return Credit (${cleanData.returnNo}): ${cleanData.description}`
        });
        await inv.save();
        upsertSnapshotItem('supplierInvoices', calculateOverdueMetrics({ ...inv.toObject(), id: inv._id.toString() }), false);
        remainingCredit -= creditApplied;
      }
    }
  } else {
    mutateSnapshot('items', (list) => {
      let idx = -1;
      if (rawItemId) {
        idx = list.findIndex(i => i._id === rawItemId || i.id === rawItemId || i._id === cleanData.itemId || i.id === cleanData.itemId);
      }
      if (idx === -1 && code) {
        idx = list.findIndex(i => (i.itemCode || '').toUpperCase() === code && (!supplierName || i.supplierName === supplierName));
      }
      if (idx === -1) return list;
      const currentQty = Number(list[idx].qtyOnHand) || 0;
      if (returnQty >= currentQty || currentQty <= 0) {
        return list.filter((_, i) => i !== idx);
      }
      const copy = [...list];
      copy[idx] = { ...copy[idx], qtyOnHand: currentQty - returnQty, updatedAt: new Date().toISOString() };
      return copy;
    });

    if (refundAmount > 0 && cleanData.refundMethod === 'Deduct from Supplier Balance' && supplierName) {
      let remainingCredit = refundAmount;
      mutateSnapshot('supplierInvoices', (list) =>
        list.map((inv) => {
          if (remainingCredit <= 0 || inv.supplierName !== supplierName || Number(inv.balance || 0) <= 0) {
            return inv;
          }
          const bal = Number(inv.balance) || 0;
          const creditApplied = Math.min(bal, remainingCredit);
          remainingCredit -= creditApplied;
          const updatedInv = {
            ...inv,
            amountPaid: Number(inv.amountPaid || 0) + creditApplied,
            balance: Math.max(0, bal - creditApplied),
            payments: [
              ...(inv.payments || []),
              {
                paymentId: `RET-${String(Date.now()).slice(-5)}`,
                paymentDate: cleanData.returnDate,
                amount: creditApplied,
                method: 'Cash',
                notes: `Return Credit (${cleanData.returnNo}): ${cleanData.description}`
              }
            ]
          };
          return calculateOverdueMetrics(updatedInv);
        })
      );
    }
  }
}

export async function createSupplierReturn(data, { fromSync = false } = {}) {
  const returnQty = Number(data.returnQty) || 1;
  const costPrice = Number(data.costPrice) || 0;
  const refundAmount = data.refundAmount !== undefined && data.refundAmount !== ''
    ? Number(data.refundAmount) || 0
    : returnQty * costPrice;

  const cleanData = {
    ...stripIds(data),
    returnNo: data.returnNo || `RET-${String(Date.now()).slice(-5)}`,
    returnDate: data.returnDate || new Date().toISOString().split('T')[0],
    returnTime: data.returnTime || new Date().toTimeString().slice(0, 5),
    itemId: data.itemId || '',
    itemCode: (data.itemCode || '').trim().toUpperCase(),
    barcode: (data.barcode || '').trim(),
    description: (data.description || '').trim(),
    supplierName: (data.supplierName || '').trim(),
    category: (data.category || 'General').trim(),
    stockUnit: (data.stockUnit || 'Units').trim(),
    returnQty,
    costPrice,
    refundAmount,
    reason: (data.reason || 'Old / Expired Stock').trim(),
    refundMethod: data.refundMethod || 'Deduct from Supplier Balance',
    notes: (data.notes || '').trim()
  };

  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      const doc = await SupplierReturn.create(cleanData);
      const created = { ...doc.toObject(), id: doc._id.toString() };
      upsertSnapshotItem('supplierReturns', created, true);
      await applySupplierReturnEffects(cleanData, true);
      return created;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for createSupplierReturn:', err.message);
  }

  const uid = generateUniqueId('ret');
  const newObj = {
    _id: uid,
    id: uid,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  upsertSnapshotItem('supplierReturns', newObj, true);
  await applySupplierReturnEffects(cleanData, false);
  enqueueOfflineOp('createSupplierReturn', [cleanData], uid);
  return newObj;
}

export async function deleteSupplierReturn(id, { fromSync = false } = {}) {
  const targetId = resolveOfflineId(id);
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      if (!fromSync) await ensureSyncedBeforeOp();
      await SupplierReturn.findByIdAndDelete(targetId);
      removeSnapshotItem('supplierReturns', id);
      return true;
    }
  } catch (err) {
    if (fromSync) throw err;
    console.warn('Offline queue used for deleteSupplierReturn:', err.message);
  }

  const beforeLen = getSnapshot('supplierReturns').length;
  removeSnapshotItem('supplierReturns', id);
  const removed = getSnapshot('supplierReturns').length < beforeLen;
  if (removed) {
    enqueueOfflineOp('deleteSupplierReturn', [id]);
  }
  return removed;
}

// === OFFLINE QUEUE SYNC & ONLINE SNAPSHOT REFRESH ===
const SYNC_HANDLERS = {
  createVehicle: (args) => createVehicle(args[0], { fromSync: true }),
  updateVehicle: (args) => updateVehicle(args[0], args[1], { fromSync: true }),
  deleteVehicle: (args) => deleteVehicle(args[0], { fromSync: true }),
  createItem: (args) => createItem(args[0], { fromSync: true }),
  updateItem: (args) => updateItem(args[0], args[1], { fromSync: true }),
  deleteItem: (args) => deleteItem(args[0], { fromSync: true }),
  createServiceRecord: (args) => createServiceRecord(args[0], { fromSync: true }),
  updateServiceRecord: (args) => updateServiceRecord(args[0], args[1], { fromSync: true }),
  deleteServiceRecord: (args) => deleteServiceRecord(args[0], { fromSync: true }),
  createJob: (args) => createJob(args[0], { fromSync: true }),
  updateJob: (args) => updateJob(args[0], args[1], { fromSync: true }),
  deleteJob: (args) => deleteJob(args[0], { fromSync: true }),
  createSupplier: (args) => createSupplier(args[0], { fromSync: true }),
  updateSupplier: (args) => updateSupplier(args[0], args[1], { fromSync: true }),
  deleteSupplier: (args) => deleteSupplier(args[0], { fromSync: true }),
  createSupplierInvoice: (args) => createSupplierInvoice(args[0], { fromSync: true }),
  recordSupplierPayment: (args) => recordSupplierPayment(args[0], args[1], { fromSync: true }),
  updateSupplierInvoice: (args) => updateSupplierInvoice(args[0], args[1], { fromSync: true }),
  deleteSupplierInvoice: (args) => deleteSupplierInvoice(args[0], { fromSync: true }),
  updateSupplierPayment: (args) => updateSupplierPayment(args[0], args[1], args[2], { fromSync: true }),
  deleteSupplierPayment: (args) => deleteSupplierPayment(args[0], args[1], { fromSync: true }),
  createExpense: (args) => createExpense(args[0], { fromSync: true }),
  updateExpense: (args) => updateExpense(args[0], args[1], { fromSync: true }),
  deleteExpense: (args) => deleteExpense(args[0], { fromSync: true }),
  createSupplierReturn: (args) => createSupplierReturn(args[0], { fromSync: true }),
  deleteSupplierReturn: (args) => deleteSupplierReturn(args[0], { fromSync: true }),
};

export async function syncOfflineQueue({ refreshSnapshot = true } = {}) {
  if (global.__syncInProgressPromise) {
    return global.__syncInProgressPromise;
  }

  global.__syncInProgressPromise = (async () => {
    try {
      await connectToDatabase();
      if (!isDbConnected()) {
        return {
          success: false,
          connected: false,
          syncedCount: 0,
          ...getOfflineSyncStatus(),
          error: 'MongoDB is offline. Changes remain safely saved locally.'
        };
      }

      const pending = [...getOfflineQueue()];
      let syncedCount = 0;

      for (const item of pending) {
        const handler = SYNC_HANDLERS[item.op];
        if (!handler) {
          removeQueueItemById(item.id);
          continue;
        }
        try {
          const result = await handler(item.args || []);
          if (item.tempId && result && (result.id || result._id)) {
            setIdMapping(item.tempId, result.id || result._id.toString());
          }
          removeQueueItemById(item.id);
          syncedCount += 1;
        } catch (opErr) {
          const msg = opErr?.message || 'Sync failed';
          markSyncError(msg);
          return {
            success: false,
            connected: isDbConnected(),
            syncedCount,
            ...getOfflineSyncStatus(),
            error: msg
          };
        }
      }

      if (refreshSnapshot) {
        const [vDocs, iDocs, sDocs, jDocs, supDocs, invDocs, retDocs, expDocs] = await Promise.all([
          Vehicle.find().sort({ createdAt: -1 }).lean(),
          Item.find().sort({ updatedAt: -1, createdAt: -1 }).lean(),
          ServiceRecord.find().sort({ serviceDate: -1, createdAt: -1 }).lean(),
          Job.find().sort({ jobName: 1 }).lean(),
          Supplier.find().sort({ supplierName: 1 }).lean(),
          SupplierInvoice.find().sort({ dueDate: 1 }).lean(),
          SupplierReturn.find().sort({ returnDate: -1, createdAt: -1 }).lean(),
          Expense.find().sort({ expenseDate: -1, createdAt: -1 }).lean(),
        ]);

        setSnapshot('vehicles', vDocs.map(d => ({ ...d, id: d._id.toString() })));
        setSnapshot('items', iDocs.map(d => ({ ...d, id: d._id.toString() })));
        setSnapshot('services', sDocs.map(d => ({ ...d, id: d._id.toString() })));
        setSnapshot('jobs', jDocs.map(d => ({ ...d, id: d._id.toString() })));
        setSnapshot('suppliers', supDocs.map(d => ({ ...d, id: d._id.toString() })));
        setSnapshot('supplierInvoices', invDocs.map(d => calculateOverdueMetrics({ ...d, id: d._id.toString() })));
        setSnapshot('supplierReturns', retDocs.map(d => ({ ...d, id: d._id.toString() })));
        setSnapshot('expenses', expDocs.map(d => ({ ...d, id: d._id.toString() })));
      }

      markSyncSuccess();
      return {
        success: true,
        connected: true,
        syncedCount,
        ...getOfflineSyncStatus()
      };
    } catch (err) {
      markSyncError(err.message);
      return {
        success: false,
        connected: isDbConnected(),
        syncedCount: 0,
        ...getOfflineSyncStatus(),
        error: err.message
      };
    } finally {
      global.__syncInProgressPromise = null;
    }
  })();

  return global.__syncInProgressPromise;
}

// === DYNAMIC FINANCIAL ANALYTICS (REVENUE, SHOULD PAY TODAY, EXPENSES) ===
export async function getFinancialAnalytics() {
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch all live records
  const [services, invoices, expenses, supplierReturns] = await Promise.all([
    getServicesByVehicleNo(),
    getSupplierInvoices(),
    getExpenses(),
    getSupplierReturns()
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

  // Supplier return credits (Cash Refund / Credit Note reduce net expenses)
  let totalReturnsCredit = 0;
  let cashReturnsCredit = 0;
  let cashReturnsToday = 0;
  supplierReturns.forEach(ret => {
    const amt = Number(ret.refundAmount) || 0;
    totalReturnsCredit += amt;
    if (ret.refundMethod !== 'Deduct from Supplier Balance') {
      cashReturnsCredit += amt;
      if (ret.returnDate === todayStr) {
        cashReturnsToday += amt;
      }
    }
  });

  const totalExpensesPaid = Math.max(0, supplierPaymentsMadeTotal + operatingExpensesPaidTotal - cashReturnsCredit);
  const expensesPaidToday = Math.max(0, supplierPaymentsMadeToday + operatingExpensesPaidToday - cashReturnsToday);
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
    totalReturnsCredit,
    netOperatingProfit,
    paymentsRequiringAttentionToday,
    recentServicesCount: services.length,
    activeSuppliersCount: (await getSuppliers()).length
  };
}
