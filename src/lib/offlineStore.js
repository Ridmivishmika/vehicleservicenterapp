import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SYNC_FILE = path.join(DATA_DIR, 'offline-sync.json');

const EMPTY_STATE = () => ({
  snapshot: {
    vehicles: [],
    items: [],
    services: [],
    jobs: [],
    suppliers: [],
    supplierInvoices: [],
    supplierReturns: [],
    expenses: []
  },
  queue: [],
  idMap: {},
  lastSyncedAt: null,
  lastSyncError: null
});

function loadState() {
  if (global.__offlineSyncState) {
    return global.__offlineSyncState;
  }
  try {
    if (fs.existsSync(SYNC_FILE)) {
      const raw = fs.readFileSync(SYNC_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      const base = EMPTY_STATE();
      global.__offlineSyncState = {
        snapshot: { ...base.snapshot, ...(parsed.snapshot || {}) },
        queue: Array.isArray(parsed.queue) ? parsed.queue : [],
        idMap: parsed.idMap && typeof parsed.idMap === 'object' ? parsed.idMap : {},
        lastSyncedAt: parsed.lastSyncedAt || null,
        lastSyncError: parsed.lastSyncError || null
      };
      return global.__offlineSyncState;
    }
  } catch (err) {
    console.warn('[OfflineStore] Failed to read offline-sync.json:', err.message);
  }
  global.__offlineSyncState = EMPTY_STATE();
  return global.__offlineSyncState;
}

function saveState(state) {
  global.__offlineSyncState = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${SYNC_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf8');
    fs.renameSync(tmpFile, SYNC_FILE);
  } catch (err) {
    console.warn('[OfflineStore] Failed to write offline-sync.json:', err.message);
  }
}

export function getSnapshot(collection) {
  const state = loadState();
  return Array.isArray(state.snapshot[collection]) ? state.snapshot[collection] : [];
}

export function setSnapshot(collection, records) {
  const state = loadState();
  state.snapshot[collection] = Array.isArray(records) ? records : [];
  saveState(state);
}

export function mutateSnapshot(collection, mutator) {
  const state = loadState();
  const current = Array.isArray(state.snapshot[collection]) ? state.snapshot[collection] : [];
  const next = mutator(current);
  if (Array.isArray(next)) {
    state.snapshot[collection] = next;
  }
  saveState(state);
}

export function enqueueOfflineOp(op, args, tempId = null) {
  const state = loadState();
  const entry = {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    op,
    args,
    tempId,
    createdAt: new Date().toISOString()
  };
  state.queue.push(entry);
  saveState(state);
  return entry;
}

export function getOfflineQueue() {
  const state = loadState();
  return state.queue;
}

export function removeQueueItemById(queueId) {
  const state = loadState();
  state.queue = state.queue.filter(q => q.id !== queueId);
  saveState(state);
}

export function resolveOfflineId(id) {
  if (!id) return id;
  const state = loadState();
  return state.idMap[id] || id;
}

export function setIdMapping(tempId, realId) {
  if (!tempId || !realId) return;
  const state = loadState();
  state.idMap[tempId] = realId;
  saveState(state);
}

export function markSyncSuccess() {
  const state = loadState();
  state.lastSyncedAt = new Date().toISOString();
  state.lastSyncError = null;
  saveState(state);
}

export function markSyncError(message) {
  const state = loadState();
  state.lastSyncError = message || 'Sync error';
  saveState(state);
}

export function getOfflineSyncStatus() {
  const state = loadState();
  return {
    pendingCount: state.queue.length,
    lastSyncedAt: state.lastSyncedAt,
    lastSyncError: state.lastSyncError,
    queuePreview: state.queue.slice(0, 10).map(q => ({
      id: q.id,
      op: q.op,
      createdAt: q.createdAt
    }))
  };
}
