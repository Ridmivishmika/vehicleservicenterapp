import { NextResponse } from 'next/server';
import { getServicesByVehicleNo, createServiceRecord } from '@/lib/dataStore';
import { isDbConnected } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleNo = searchParams.get('vehicleNo');
    const records = await getServicesByVehicleNo(vehicleNo);

    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: records
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.vehicleNo) {
      return NextResponse.json(
        { success: false, message: 'Vehicle Number is required to record a service.' },
        { status: 400 }
      );
    }

    const created = await createServiceRecord(body);
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: created
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
