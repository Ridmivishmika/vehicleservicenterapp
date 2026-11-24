import nodemailer from 'nodemailer';

/**
 * Checks whether required SMTP environment variables are configured.
 */
export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

/**
 * Creates a reusable Nodemailer SMTP transporter from environment variables.
 */
function createSmtpTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Sends a 1-week next-service reminder email to a vehicle owner via SMTP.
 */
export async function sendNextServiceReminderEmail({
  to,
  ownerName,
  vehicleNo,
  vModel,
  serviceType,
  lastServiceDate,
  nextServiceDate,
  nextServiceMeter
}) {
  if (!isSmtpConfigured()) {
    throw new Error('SMTP is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local.');
  }
  if (!to || !to.includes('@')) {
    throw new Error(`Invalid or missing owner email address for vehicle ${vehicleNo}.`);
  }

  const transporter = createSmtpTransporter();
  const fromAddress =
    process.env.SMTP_FROM || `"Auto Care Service Center" <${process.env.SMTP_USER}>`;

  const displayOwner = ownerName || 'Valued Customer';
  const displayModel = vModel ? ` (${vModel})` : '';
  const meterLine = nextServiceMeter
    ? `<li><strong>Recommended Mileage:</strong> ${Number(nextServiceMeter).toLocaleString()} KM</li>`
    : '';
  const meterText = nextServiceMeter
    ? `\nRecommended Mileage: ${Number(nextServiceMeter).toLocaleString()} KM`
    : '';

  const subject = `Service Reminder: ${vehicleNo} is due for next service on ${nextServiceDate}`;

  const text = `Dear ${displayOwner},

This is a friendly reminder from Auto Care Service Center that your vehicle ${vehicleNo}${displayModel} is due for its next scheduled service in about one week.

Next Service Date: ${nextServiceDate}${meterText}
Last Service: ${serviceType || 'Vehicle Service'} on ${lastServiceDate || '-'}

Please contact us to book your appointment:
Auto Care Service Center
No 146, Deniyaya Road, Akuressa
Tel: +94 412283131 / +94 704909320
Email: lakshanwasindu@gmail.com

Thank you!`;

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 18px; letter-spacing: 0.5px;">AUTO CARE SERVICE CENTER</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Scheduled Vehicle Service Reminder</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; font-size: 14px; line-height: 1.6;">
        <p style="margin-top: 0;">Dear <strong>${displayOwner}</strong>,</p>
        <p>This is a friendly reminder that your vehicle <strong style="color: #1d4ed8;">${vehicleNo}</strong>${displayModel} is due for its next service in approximately <strong>one week</strong>.</p>
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 16px; margin: 16px 0;">
          <ul style="margin: 0; padding-left: 18px; font-size: 13px;">
            <li><strong>Vehicle Number:</strong> ${vehicleNo}${displayModel}</li>
            <li><strong>Next Service Due Date:</strong> ${nextServiceDate}</li>
            ${meterLine}
            <li><strong>Previous Service:</strong> ${serviceType || 'Vehicle Service'} (${lastServiceDate || '-'})</li>
          </ul>
        </div>
        <p style="margin-bottom: 0;">To reserve a convenient time slot, please call us on <strong>+94 412283131</strong> or <strong>+94 704909320</strong>.</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0;">
        <strong>Auto Care Service Center</strong><br/>
        No 146, Deniyaya Road, Akuressa | Reg: 7/3594<br/>
        Tel: +94 412283131 / +94 704909320 | Email: lakshanwasindu@gmail.com
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted
  };
}
