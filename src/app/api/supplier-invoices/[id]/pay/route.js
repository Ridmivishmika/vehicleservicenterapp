import { NextResponse } from 'next/server';
import { recordSupplierPayment } from '@/lib/dataStore';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.amount) {
      return NextResponse.json({ success: false, message: 'Payment Amount is required.' }, { status: 400 });
    }
    const updatedInvoice = await recordSupplierPayment(id, body);
    if (!updatedInvoice) {
      return NextResponse.json({ success: false, message: 'Invoice not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedInvoice });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
