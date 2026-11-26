import { NextResponse } from 'next/server';
import { getSupplierReturns, createSupplierReturn } from '@/lib/dataStore';

export async function GET() {
  try {
    const returns = await getSupplierReturns();
    return NextResponse.json({ success: true, data: returns });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.description || !body.supplierName) {
      return NextResponse.json(
        { success: false, message: 'Supplier Name and Item Description are required.' },
        { status: 400 }
      );
    }
    const created = await createSupplierReturn(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
