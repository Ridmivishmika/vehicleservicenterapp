import { NextResponse } from 'next/server';
import { updateServiceRecord, deleteServiceRecord, getServiceRecordById } from '@/lib/dataStore';
import { isDbConnected } from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const doc = await getServiceRecordById(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Service bill record not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: doc
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateServiceRecord(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Service record not found' }, { status: 404 });
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
    const deleted = await deleteServiceRecord(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Service record not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      message: 'Service record removed'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
