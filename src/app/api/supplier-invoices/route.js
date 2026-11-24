import { NextResponse } from 'next/server';
import { getSupplierInvoices, createSupplierInvoice } from '@/lib/dataStore';

export async function GET() {
  try {
    const invoices = await getSupplierInvoices();
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.supplierName || !body.invoiceNo || !body.invoiceAmount) {
      return NextResponse.json(
        { success: false, message: 'Supplier Name, Invoice Number, and Invoice Amount are required.' },
        { status: 400 }
      );
    }
    const created = await createSupplierInvoice(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
