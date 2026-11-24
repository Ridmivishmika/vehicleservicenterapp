import { NextResponse } from 'next/server';
import { connectToDatabase, getDbStatus } from '@/lib/mongodb';

export async function GET() {
  await connectToDatabase();
  const status = getDbStatus();

  return NextResponse.json({
    connected: status.connected,
    status: status.connected ? 'connected' : 'standby',
    message: status.connected ? `Connected to MongoDB (${status.name || 'db'})` : 'No database connected (Provide DB link in .env.local or UI Settings)',
    uri: status.uriMasked,
    configured: status.configured,
    error: status.error
  });
}
