import { NextResponse } from 'next/server';
import { deleteSupplierReturn } from '@/lib/dataStore';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteSupplierReturn(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Return record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Return record deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
