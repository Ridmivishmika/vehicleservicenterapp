import { NextResponse } from 'next/server';
import { getDbStatus, updateMongoUri, connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    const status = getDbStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { uri } = body;
    const status = await updateMongoUri(uri);
    return NextResponse.json({
      success: true,
      message: status.connected ? 'Successfully connected to MongoDB!' : (status.error || 'Connection failed. Please verify your MongoDB URI.'),
      ...status
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
