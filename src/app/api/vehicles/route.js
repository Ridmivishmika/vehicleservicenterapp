import { NextResponse } from 'next/server';
import { getVehicles, createVehicle } from '@/lib/dataStore';
import { isDbConnected } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    let vehicles = await getVehicles();

    if (search) {
      const q = search.toLowerCase();
      vehicles = vehicles.filter(v => 
        (v.vehicleNo && v.vehicleNo.toLowerCase().includes(q)) ||
        (v.csName && v.csName.toLowerCase().includes(q)) ||
        (v.tagNo && v.tagNo.toLowerCase().includes(q)) ||
        (v.vModel && v.vModel.toLowerCase().includes(q)) ||
        (v.city && v.city.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: vehicles
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.vehicleNo || !body.csName) {
      return NextResponse.json(
        { success: false, message: 'Vehicle Number and Customer Name are required.' },
        { status: 400 }
      );
    }

    const created = await createVehicle(body);
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: created
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
