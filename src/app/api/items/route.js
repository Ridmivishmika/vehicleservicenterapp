import { NextResponse } from 'next/server';
import { getItems, createItem } from '@/lib/dataStore';

export async function GET() {
  try {
    const items = await getItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.description) {
      return NextResponse.json({ success: false, message: 'Description is required' }, { status: 400 });
    }
    const created = await createItem(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
