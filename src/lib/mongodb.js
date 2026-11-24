import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Read from process.env or .env.local file directly as fallback
function getInitialUri() {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) {
    return process.env.MONGODB_URI.trim();
  }
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^MONGODB_URI=(.*)$/m);
      if (match && match[1] && match[1].trim()) {
        return match[1].trim();
      }
    }
  } catch (err) {
    console.warn('[MongoDB] Could not read .env.local:', err.message);
  }
  return '';
}

let activeUri = getInitialUri();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isConnected: false, lastError: null };
}

export function maskUri(uri) {
  if (!uri) return '';
  return uri.replace(/:([^:@]+)@/, ':••••••••@');
}

export function getActiveUri() {
  return activeUri;
}

export async function connectToDatabase(overrideUri = null) {
  const uriToUse = (overrideUri || activeUri || '').trim();

  if (!uriToUse) {
    cached.isConnected = false;
    cached.lastError = 'No MongoDB URI configured. Please provide your connection link in .env.local or via Database Settings.';
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1 && activeUri === uriToUse) {
    cached.isConnected = true;
    return cached.conn;
  }

  // If URI changed or disconnected, reset connection
  if (overrideUri && overrideUri !== activeUri) {
    activeUri = overrideUri;
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch {}
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      tlsAllowInvalidCertificates: true,
      dbName: 'service_center_db',
    };

    cached.promise = mongoose.connect(uriToUse, opts)
      .then((mongooseInstance) => {
        cached.isConnected = true;
        cached.lastError = null;
        console.log(`[MongoDB] Connected successfully to: ${maskUri(uriToUse)}`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.isConnected = false;
        cached.lastError = err.message;
        console.log('[MongoDB] Connection error:', err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    cached.isConnected = mongoose.connection.readyState === 1;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.isConnected = false;
    cached.lastError = e.message;
  }

  return cached.conn;
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export function getDbStatus() {
  const isConn = mongoose.connection.readyState === 1;
  return {
    connected: isConn,
    readyState: mongoose.connection.readyState,
    host: isConn ? mongoose.connection.host : null,
    port: isConn ? mongoose.connection.port : null,
    name: isConn ? mongoose.connection.name : null,
    uriMasked: maskUri(activeUri),
    configured: Boolean(activeUri && activeUri.trim()),
    error: cached?.lastError || null
  };
}

export async function updateMongoUri(newUri) {
  const cleanUri = (newUri || '').trim();
  activeUri = cleanUri;
  process.env.MONGODB_URI = cleanUri;

  // Persist to .env.local
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = `# ==============================================================================
# MONGODB CONNECTION STRING
# ==============================================================================
# Paste your MongoDB link below (MongoDB Atlas or Local MongoDB).
#
# Examples:
# MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/service_center_db?retryWrites=true&w=majority
#
# Local MongoDB:
# MONGODB_URI=mongodb://127.0.0.1:27017/service_center_db
# ==============================================================================
MONGODB_URI=${cleanUri}
`;
    fs.writeFileSync(envPath, content, 'utf8');
  } catch (err) {
    console.error('Failed to write .env.local:', err.message);
  }

  // Reconnect
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch {}
  cached.conn = null;
  cached.promise = null;

  if (cleanUri) {
    await connectToDatabase(cleanUri);
  } else {
    cached.isConnected = false;
    cached.lastError = 'MongoDB link cleared.';
  }

  return getDbStatus();
}
