import { NextResponse } from 'next/server';
import { getJobs, createJob } from '@/lib/dataStore';
import { isDbConnected } from '@/lib/mongodb';

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: jobs
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.jobName || !body.jobName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Job / Service Name is required.' },
        { status: 400 }
      );
    }

    const created = await createJob(body);
    return NextResponse.json({
      success: true,
      database: isDbConnected() ? 'mongodb' : 'standby_cache',
      data: created
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
