'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Printer,
  ArrowLeft,
  Receipt,
  Car,
  User,
  Calendar,
  Clock,
  Gauge,
  Wrench,
  CheckCircle2,
  Package,
  Phone,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function BillPrintPage({ params }) {
  const resolvedParams = use(params);
  const billId = resolvedParams.id;

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBill() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/services/${encodeURIComponent(billId)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setBill(json.data);
        } else {
          setError(json.message || 'Bill not found');
        }
      } catch (err) {
        setError('Failed to fetch bill details: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    if (billId) {
      loadBill();
    }
  }, [billId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-slate-700 text-sm">Loading Customer Service Bill...</p>
          <p className="text-xs text-slate-400 font-mono">Invoice Reference: {billId}</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-rose-200 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">Service Bill Not Found</h2>
          <p className="text-xs text-slate-600">{error || 'Could not locate service bill record with this identifier.'}</p>
          <div className="pt-2 flex justify-center gap-2">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
            >
              Return to Service Center
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const partsList = bill.parts || (bill.items ? bill.items.filter(i => i.itemType === 'item') : []);
  const partsSubtotal = bill.partsTotal || partsList.reduce((s, p) => s + Number(p.total || ((p.quantity || 1) * (p.unitPrice || 0))), 0);
  const laborCharge = Number(bill.laborCharges || bill.jobTotal || 0);
  const discountAmt = Number(bill.discount || bill.totalDis || 0);
  const grandTotal = Number(bill.billTotal || bill.grandTotal || bill.totalAmount || (laborCharge + partsSubtotal - discountAmt));

  return (
    <div className="min-h-screen bg-slate-200 text-slate-800 py-6 px-4 print:p-0 print:bg-white print:text-black">
      {/* Top Floating Action Bar (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-4 bg-slate-900 text-white p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.opener) {
                window.close();
              } else {
                window.location.href = '/';
              }
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Back / Close"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Page</span>
          </button>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-400" />
              Customer Service Bill Preview
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">Invoice #{bill.invoiceNo || bill.serviceNo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Bill
          </button>
        </div>
      </div>

      {/* Printable Sheet (Paper styled container) */}
      <div className="print-area max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-4 sm:p-8 space-y-5 sm:space-y-6 print:shadow-none print:border-none print:p-0 print:max-w-full">
        {/* Company Letterhead */}
        <div className="text-center border-b-2 border-slate-900 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
            AUTO CARE SERVICE CENTER
          </h2>
          <p className="text-xs font-bold text-slate-800 tracking-wide mt-1">
            Business Registration No: <span className="font-mono font-black text-slate-900">7/3594</span>
          </p>
          <p className="text-xs font-medium text-slate-700 mt-0.5">
            No 146, Deniyaya Road, Akuressa, Sri Lanka
          </p>
          <p className="text-xs text-slate-600 font-mono mt-0.5">
            Tel: +94 412283131 / +94 704909320 | Email: lakshanwasindu@gmail.com
          </p>
          <div className="mt-2 inline-block bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-4 py-0.5 rounded-full print:bg-slate-200 print:text-black">
            Customer Service Invoice & Receipt
          </div>
        </div>

        {/* Invoice Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 print:bg-white print:border-slate-300">
          <div className="space-y-1">
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Invoice / Job No:</strong>{' '}
              <span className="font-mono font-bold text-slate-900 text-sm">{bill.invoiceNo || bill.serviceNo}</span>
            </p>
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Vehicle Registration No:</strong>{' '}
              <span className="font-mono font-black text-blue-900 text-base">{bill.vehicleNo}</span>
            </p>
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Customer Name:</strong>{' '}
              <span className="font-bold text-slate-900">{bill.csName || 'Valued Customer'}</span>
            </p>
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Odometer Mileage:</strong>{' '}
              <span className="font-mono font-bold text-slate-900">
                {Number(bill.meterReading || bill.odometer || 0).toLocaleString()} KM
              </span>
            </p>
          </div>

          <div className="space-y-1 sm:text-right print:text-right border-t sm:border-t-0 print:border-t-0 border-slate-200 pt-2 sm:pt-0 print:pt-0">
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Service Date:</strong>{' '}
              <span className="font-mono font-bold text-slate-900">{bill.serviceDate}</span>
              {bill.serviceTime && <span className="font-mono text-slate-500 text-[11px]"> ({bill.serviceTime})</span>}
            </p>
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Service Package / Job:</strong>{' '}
              <span className="font-black text-slate-900">{bill.serviceType}</span>
            </p>
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Payment Method:</strong>{' '}
              <span className="font-black uppercase text-emerald-800">{bill.paymentType || bill.paymentMethod || 'CASH'}</span>
            </p>
            <p>
              <strong className="text-slate-600 uppercase text-[10px]">Lead Technician:</strong>{' '}
              <span className="font-medium text-slate-800">{bill.technician || 'Workshop Staff'}</span>
            </p>
          </div>
        </div>

        {/* Used Parts, Lubricants & Consumables Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              Parts, Lubricants & Consumables Supplied
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">{partsList.length} Item{partsList.length === 1 ? '' : 's'}</span>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
                <tr>
                  <th className="p-2.5 w-10 text-center">#</th>
                  <th className="p-2.5">Item Description & Part Code</th>
                  <th className="p-2.5 w-16 text-center">Qty</th>
                  <th className="p-2.5 w-28 text-right">Unit Price (LKR)</th>
                  <th className="p-2.5 w-32 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {partsList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-400 italic">
                      No replacement parts or consumables required for this service.
                    </td>
                  </tr>
                ) : (
                  partsList.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-semibold text-slate-900">
                        {p.name || p.description}
                        {p.code && <span className="block text-[10px] text-slate-400 font-mono">{p.code}</span>}
                      </td>
                      <td className="p-2 text-center font-mono font-bold">{p.quantity || p.qty || 1}</td>
                      <td className="p-2 text-right font-mono">
                        {Number(p.unitPrice || p.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">
                        {Number(p.total || ((p.quantity || 1) * (p.unitPrice || 0))).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill Calculation Totals */}
        <div className="border-t-2 border-slate-900 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-700">
            <span className="font-semibold">{bill.serviceType} Base Labor Fee:</span>
            <span className="font-mono font-bold text-slate-900">
              LKR {laborCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-slate-700">
            <span className="font-semibold">Used Items & Replacement Parts Subtotal:</span>
            <span className="font-mono font-bold text-slate-900">
              LKR {partsSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {discountAmt > 0 && (
            <div className="flex justify-between text-rose-600 font-semibold">
              <span>Less Promotional Discount:</span>
              <span className="font-mono font-bold">
                - LKR {discountAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-base font-black border-t-2 border-slate-900 pt-2 text-slate-900">
            <span className="uppercase tracking-wider">Grand Total Bill Amount:</span>
            <span className="font-mono text-xl sm:text-2xl text-blue-900">
              LKR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Next Service Due Recommendation Box */}
        {(bill.nextServiceMeter || bill.nextServiceMileage || bill.nextServiceDate) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex flex-wrap justify-between items-center gap-2 print:bg-white print:border-slate-300">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Next Service Due Recommendation:
            </span>
            <span className="font-mono font-black text-sm text-blue-950">
              {(bill.nextServiceMeter || bill.nextServiceMileage) ? `${(bill.nextServiceMeter || bill.nextServiceMileage).toLocaleString()} KM` : ''}
              {bill.nextServiceDate ? ` (on or before ${bill.nextServiceDate})` : ''}
            </span>
          </div>
        )}

        {/* Technician Diagnostics / Remarks */}
        {bill.technicianNotes && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
            <strong className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Technician Remarks & Inspection Findings:</strong>
            <p>{bill.technicianNotes}</p>
          </div>
        )}

        {/* Signature & Seal Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 sm:gap-8 pt-8 sm:pt-10 text-center text-xs text-slate-700">
          <div>
            <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
            <span className="font-semibold">Customer Signature</span>
          </div>
          <div>
            <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
            <span className="font-semibold">Authorized Signature & Workshop Seal</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
