import { NextResponse } from 'next/server';
import { updateItem, deleteItem } from '@/lib/dataStore';

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateItem(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const success = await deleteItem(id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
