import { NextResponse } from 'next/server';
import {
  getVehicles,
  getServicesByVehicleNo,
  getServiceRecordById,
  updateServiceRecord
} from '@/lib/dataStore';
import { isSmtpConfigured, sendNextServiceReminderEmail } from '@/lib/mailer';

function daysBetweenTodayAnd(dateStr) {
  if (!dateStr) return null;
  const parsed = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getLatestServicePerVehicle(services) {
  const byVehicle = new Map();
  for (const srv of services) {
    const vNo = (srv.vehicleNo || '').trim().toUpperCase();
    if (!vNo || !srv.nextServiceDate) continue;
    const existing = byVehicle.get(vNo);
    if (!existing) {
      byVehicle.set(vNo, srv);
      continue;
    }
    const srvDate = new Date(srv.serviceDate || srv.createdAt || 0).getTime();
    const extDate = new Date(existing.serviceDate || existing.createdAt || 0).getTime();
    if (srvDate > extDate) {
      byVehicle.set(vNo, srv);
    }
  }
  return Array.from(byVehicle.values());
}

/**
 * GET /api/reminders/send
 * Lists vehicles whose nextServiceDate is within 0-7 days from today.
 */
export async function GET() {
  try {
    const [vehicles, services] = await Promise.all([
      getVehicles(),
      getServicesByVehicleNo()
    ]);

    const vehicleMap = new Map(
      vehicles.map((v) => [(v.vehicleNo || '').trim().toUpperCase(), v])
    );

    const latestServices = getLatestServicePerVehicle(services);
    const dueSoon = [];

    for (const srv of latestServices) {
      const diffDays = daysBetweenTodayAnd(srv.nextServiceDate);
      if (diffDays === null || diffDays < 0 || diffDays > 7) continue;

      const vNo = (srv.vehicleNo || '').trim().toUpperCase();
      const vehicle = vehicleMap.get(vNo);

      dueSoon.push({
        serviceId: srv.id || srv._id,
        vehicleNo: vNo,
        ownerName: vehicle?.csName || srv.csName || 'Valued Customer',
        ownerEmail: vehicle?.email || '',
        vModel: vehicle?.vModel || '',
        serviceType: srv.serviceType,
        lastServiceDate: srv.serviceDate,
        nextServiceDate: srv.nextServiceDate,
        nextServiceMeter: srv.nextServiceMeter || 0,
        daysUntilDue: diffDays,
        reminderSent: Boolean(srv.reminderSent),
        reminderSentAt: srv.reminderSentAt || ''
      });
    }

    return NextResponse.json({
      success: true,
      smtpConfigured: isSmtpConfigured(),
      dueSoonCount: dueSoon.length,
      pendingCount: dueSoon.filter((d) => !d.reminderSent).length,
      items: dueSoon
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reminders/send
 * Sends 1-week service reminder emails via SMTP.
 * Body (optional): { serviceId?: string, force?: boolean, mode?: 'auto' | 'manual' }
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { serviceId, force = false, mode = 'auto' } = body || {};

    if (!isSmtpConfigured()) {
      if (serviceId || mode === 'manual') {
        return NextResponse.json(
          {
            success: false,
            smtpConfigured: false,
            message:
              'SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to .env.local.'
          },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        smtpConfigured: false,
        sentCount: 0,
        skippedCount: 0,
        failedCount: 0,
        details: []
      });
    }

    const vehicles = await getVehicles();
    const vehicleMap = new Map(
      vehicles.map((v) => [(v.vehicleNo || '').trim().toUpperCase(), v])
    );

    let targets = [];
    if (serviceId) {
      const record = await getServiceRecordById(serviceId);
      if (!record) {
        return NextResponse.json(
          { success: false, message: 'Service record not found.' },
          { status: 404 }
        );
      }
      targets = [record];
    } else {
      const allServices = await getServicesByVehicleNo();
      targets = getLatestServicePerVehicle(allServices);
    }

    let sentCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const details = [];

    for (const srv of targets) {
      const srvId = srv.id || srv._id;
      const vNo = (srv.vehicleNo || '').trim().toUpperCase();
      const diffDays = daysBetweenTodayAnd(srv.nextServiceDate);

      if (!srv.nextServiceDate) {
        skippedCount++;
        details.push({ serviceId: srvId, vehicleNo: vNo, status: 'skipped', reason: 'No nextServiceDate set' });
        continue;
      }

      if (!serviceId && (diffDays === null || diffDays < 0 || diffDays > 7)) {
        continue;
      }

      if (srv.reminderSent && !force) {
        skippedCount++;
        details.push({ serviceId: srvId, vehicleNo: vNo, status: 'skipped', reason: 'Reminder already sent' });
        continue;
      }

      const vehicle = vehicleMap.get(vNo);
      const ownerEmail = (vehicle?.email || '').trim();
      if (!ownerEmail || !ownerEmail.includes('@')) {
        skippedCount++;
        details.push({
          serviceId: srvId,
          vehicleNo: vNo,
          status: 'skipped',
          reason: 'Vehicle owner email is missing'
        });
        continue;
      }

      try {
        const result = await sendNextServiceReminderEmail({
          to: ownerEmail,
          ownerName: vehicle?.csName || srv.csName,
          vehicleNo: vNo,
          vModel: vehicle?.vModel || '',
          serviceType: srv.serviceType,
          lastServiceDate: srv.serviceDate,
          nextServiceDate: srv.nextServiceDate,
          nextServiceMeter: srv.nextServiceMeter || 0
        });

        const sentAt = new Date().toISOString();
        await updateServiceRecord(srvId, {
          reminderSent: true,
          reminderSentAt: sentAt
        });

        sentCount++;
        details.push({
          serviceId: srvId,
          vehicleNo: vNo,
          to: ownerEmail,
          status: 'sent',
          messageId: result.messageId
        });
      } catch (err) {
        failedCount++;
        details.push({
          serviceId: srvId,
          vehicleNo: vNo,
          to: ownerEmail,
          status: 'failed',
          error: err.message
        });
      }
    }

    if (serviceId && sentCount === 0 && skippedCount > 0) {
      const first = details[0];
      return NextResponse.json(
        {
          success: false,
          smtpConfigured: true,
          message: first?.reason || 'Could not send reminder email.',
          details
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      smtpConfigured: true,
      sentCount,
      skippedCount,
      failedCount,
      details
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
