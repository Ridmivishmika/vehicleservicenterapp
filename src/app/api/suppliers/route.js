import { NextResponse } from 'next/server';
import { getSuppliers, createSupplier } from '@/lib/dataStore';

export async function GET() {
  try {
    const suppliers = await getSuppliers();
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.supplierName) {
      return NextResponse.json({ success: false, message: 'Supplier Name is required.' }, { status: 400 });
    }
    const created = await createSupplier(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
