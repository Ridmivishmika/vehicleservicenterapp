import { NextResponse } from 'next/server';
import { updateSupplierPayment, deleteSupplierPayment } from '@/lib/dataStore';

export async function PUT(request, context) {
  try {
    const { id, paymentId } = await context.params;
    const body = await request.json();
    const updated = await updateSupplierPayment(id, paymentId, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id, paymentId } = await context.params;
    const updated = await deleteSupplierPayment(id, paymentId);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: 'Payment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
