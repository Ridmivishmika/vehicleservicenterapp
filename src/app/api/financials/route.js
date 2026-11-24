import { NextResponse } from 'next/server';
import { getFinancialAnalytics } from '@/lib/dataStore';

export async function GET() {
  try {
    const analytics = await getFinancialAnalytics();
    return NextResponse.json(analytics, { status: 200 });
  } catch (err) {
    console.error('Error fetching financial analytics:', err);
    return NextResponse.json({ error: 'Failed to fetch financial analytics' }, { status: 500 });
  }
}
