import { NextResponse } from 'next/server';
import { getDbStatus, connectToDatabase } from '@/lib/mongodb';
import { getOfflineSyncStatus } from '@/lib/offlineStore';
import { syncOfflineQueue } from '@/lib/dataStore';

export async function GET() {
  try {
    await connectToDatabase();
    const db = getDbStatus();
    const sync = getOfflineSyncStatus();
    return NextResponse.json({
      success: true,
      connected: db.connected,
      ...sync
    });
  } catch (err) {
    const sync = getOfflineSyncStatus();
    return NextResponse.json({
      success: false,
      connected: false,
      ...sync,
      error: err.message
    });
  }
}

export async function POST() {
  try {
    const result = await syncOfflineQueue({ refreshSnapshot: true });
    return NextResponse.json(result, { status: result.connected ? 200 : 503 });
  } catch (err) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: err.message,
      ...getOfflineSyncStatus()
    }, { status: 500 });
  }
}
