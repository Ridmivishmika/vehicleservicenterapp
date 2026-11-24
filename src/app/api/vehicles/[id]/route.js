import { NextResponse } from 'next/server';
import { updateVehicle, deleteVehicle, getVehicles } from '@/lib/dataStore';
import { isDbConnected } from '@/lib/mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateVehicle(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteVehicle(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
