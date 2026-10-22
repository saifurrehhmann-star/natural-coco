import { useRef } from 'react';
import { X, Printer, Download, Leaf, Receipt } from 'lucide-react';
import type { OrderDetails } from '@/types';
import { rs } from '@/utils/format';

interface Props {
  order: OrderDetails | null;
  open: boolean;
  onClose: () => void;
}

export function OrderReceiptModal({ order, open, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement | null>(null);

  if (!open || !order) return null;

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      // Fallback if popup blocked: use direct window.print()
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.ref} - Natura Coco</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #1a2e1f;
              background: #fff;
              padding: 24px;
              font-size: 12px;
              line-height: 1.5;
            }
            .slip-card {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 28px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #cbd5e1;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .brand-name {
              font-size: 24px;
              font-weight: 800;
              color: #15803d;
              letter-spacing: -0.5px;
            }
            .brand-sub {
              font-size: 11px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 4px;
            }
            .ref-badge {
              display: inline-block;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 4px 12px;
              border-radius: 9999px;
              font-weight: 800;
              font-size: 12px;
              margin-top: 10px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 20px;
              background: #f8fafc;
              padding: 14px;
              border-radius: 12px;
              border: 1px solid #edf2f7;
            }
            .meta-item strong {
              display: block;
              font-size: 10px;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              text-align: left;
              font-size: 10px;
              text-transform: uppercase;
              color: #64748b;
              border-bottom: 1px solid #e2e8f0;
              padding: 8px 4px;
            }
            td {
              padding: 10px 4px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 12px;
            }
            .total-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .total-table td {
              border: none;
              padding: 4px 0;
            }
            .grand-total {
              font-size: 16px;
              font-weight: 800;
              color: #ea580c;
              border-top: 2px solid #e2e8f0;
              padding-top: 8px !important;
              margin-top: 6px;
            }
            .footer-note {
              text-align: center;
              margin-top: 28px;
              padding-top: 16px;
              border-top: 1px dashed #cbd5e1;
              color: #64748b;
              font-size: 11px;
            }
            @media print {
              body { padding: 0; }
              .slip-card { border: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="slip-card">
            <div class="header">
              <div class="brand-name">Natura Coco</div>
              <div class="brand-sub">Pure Coconut Water & Cold-Pressed Juices</div>
              <div style="font-size: 11px; color: #475569; margin-top: 4px;">
                Bahadurabad Chowrangi, Karachi 74800 · Tel: +92 300 1234567
              </div>
              <div class="ref-badge">TAX INVOICE & DELIVERY SLIP · ${order.ref}</div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <strong>Customer Mobile:</strong>
                ${order.phone}
              </div>
              <div class="meta-item">
                <strong>Order Date & Time:</strong>
                ${order.placedAt}
              </div>
              <div class="meta-item" style="grid-column: span 2;">
                <strong>Fulfillment & Destination:</strong>
                ${order.mode === 'pickup' ? 'Flagship Store Pickup (Karachi)' : order.address || 'Karachi Local'}
              </div>
              <div class="meta-item">
                <strong>Payment Mode:</strong>
                ${order.paymentMethod || 'Cash on Delivery (COD)'}
              </div>
              <div class="meta-item">
                <strong>Current Stage:</strong>
                ${
                  order.stage === 'delivered'
                    ? 'Delivered / Completed'
                    : order.stage === 'transit'
                    ? 'In Transit / Ready for Pickup'
                    : order.stage === 'prep'
                    ? 'Under Preparation'
                    : 'Order Placed & Confirmed'
                }
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (i) => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #0f172a;">${i.name}</div>
                      ${
                        i.variations && i.variations.length > 0
                          ? `<div style="font-size: 10px; color: #64748b;">${i.variations.map((v) => v.label).join(', ')}</div>`
                          : ''
                      }
                    </td>
                    <td style="text-align: center; font-weight: 700;">${i.quantity}</td>
                    <td style="text-align: right;">Rs. ${i.basePrice.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 700;">Rs. ${(i.basePrice * i.quantity).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>

            <table class="total-table">
              <tr>
                <td style="color: #64748b;">Items Subtotal:</td>
                <td style="text-align: right; font-weight: 600;">Rs. ${order.itemsTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">GST / Sales Tax (5%):</td>
                <td style="text-align: right; font-weight: 600;">Rs. ${order.tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Delivery Charges:</td>
                <td style="text-align: right; font-weight: 600;">${order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee.toLocaleString()}`}</td>
              </tr>
              <tr class="grand-total">
                <td style="font-weight: 800; font-size: 15px;">TOTAL PAYABLE:</td>
                <td style="text-align: right; font-weight: 800; font-size: 17px; color: #ea580c;">
                  Rs. ${order.total.toLocaleString()}
                </td>
              </tr>
            </table>

            <div class="footer-note">
              <p>Thank you for choosing Natura Coco! Real, fresh, hydrating goodness.</p>
              <p style="margin-top: 4px; font-size: 10px;">For customer queries or feedback, WhatsApp +92 300 1234567</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-palm-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col h-full max-h-[92vh] w-full max-w-xl bg-white rounded-3xl shadow-lift overflow-hidden border border-palm-200">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-palm-200 px-6 py-4 bg-palm-50/70">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-palm-600 text-white">
              <Receipt size={17} />
            </span>
            <div>
              <h2 className="font-display text-sm font-extrabold text-palm-900">
                Order Receipt & Invoice Slip
              </h2>
              <span className="text-[11px] font-bold text-palm-600">{order.ref}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-full bg-palm-800 hover:bg-palm-900 text-white px-4 py-2 text-xs font-bold shadow-soft transition active:scale-95 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-palm-200/80 text-palm-700 hover:bg-palm-300 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-cream-50/50">
          <div
            ref={receiptRef}
            className="rounded-2xl border border-palm-200 bg-white p-6 shadow-soft space-y-5"
          >
            {/* Slip Header */}
            <div className="text-center border-b border-dashed border-palm-200 pb-5">
              <div className="flex items-center justify-center gap-2 text-palm-700 font-extrabold text-xl font-display">
                <Leaf size={22} className="text-palm-600" />
                <span>Natura Coco</span>
              </div>
              <p className="text-[11px] font-semibold text-palm-500 uppercase tracking-wider mt-0.5">
                Pure Coconut Water & Natural Juices
              </p>
              <p className="text-[11px] text-palm-500 mt-1">
                Bahadurabad Chowrangi, Karachi 74800 · Hotline: +92 300 1234567
              </p>
              <div className="mt-3 inline-block rounded-full bg-palm-100 text-palm-900 px-4 py-1 text-xs font-extrabold tracking-wide border border-palm-200 font-mono">
                TAX INVOICE SLIP #{order.ref}
              </div>
            </div>

            {/* Customer & Fulfillment Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-cream-50 p-4 rounded-xl border border-palm-100">
              <div>
                <span className="text-[10px] font-bold text-palm-400 uppercase tracking-wider block">Customer Mobile</span>
                <span className="font-extrabold text-palm-900 text-xs">{order.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-palm-400 uppercase tracking-wider block">Order Date & Time</span>
                <span className="font-semibold text-palm-800 text-xs">{order.placedAt}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold text-palm-400 uppercase tracking-wider block">Delivery Destination</span>
                <span className="font-medium text-palm-900 text-xs">
                  {order.mode === 'pickup' ? 'Flagship Store Pickup (Bahadurabad Karachi)' : order.address || 'Karachi Local Delivery'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-palm-400 uppercase tracking-wider block">Payment Method</span>
                <span className="font-extrabold text-palm-900 text-xs">{order.paymentMethod || 'Cash on Delivery (COD)'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-palm-400 uppercase tracking-wider block">Order Stage</span>
                <span className="chip bg-palm-100 text-palm-800 text-[10px] font-extrabold py-0.5">
                  {order.stage === 'delivered'
                    ? 'Delivered'
                    : order.stage === 'transit'
                    ? 'In Transit / Ready'
                    : order.stage === 'prep'
                    ? 'Preparing'
                    : 'Placed'}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-palm-400 uppercase tracking-wider border-b border-palm-200 pb-2 mb-2">
                <span>Item</span>
                <div className="flex gap-8">
                  <span className="w-8 text-center">Qty</span>
                  <span className="w-16 text-right">Price</span>
                  <span className="w-16 text-right">Total</span>
                </div>
              </div>

              <div className="divide-y divide-palm-100 space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-2 text-xs">
                    <div className="flex-1 pr-3">
                      <p className="font-extrabold text-palm-900">{item.name}</p>
                      {item.variations && item.variations.length > 0 && (
                        <p className="text-[10px] text-palm-500">
                          {item.variations.map((v) => v.label).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-8 items-center text-xs">
                      <span className="w-8 text-center font-bold text-palm-800">{item.quantity}</span>
                      <span className="w-16 text-right text-palm-600">{rs(item.basePrice)}</span>
                      <span className="w-16 text-right font-extrabold text-palm-900">
                        {rs(item.basePrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-palm-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-palm-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold">{rs(order.itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-palm-600">
                <span>GST / Tax (5%):</span>
                <span className="font-semibold">{rs(order.tax)}</span>
              </div>
              <div className="flex justify-between text-palm-600">
                <span>Delivery Charges:</span>
                <span className="font-semibold">{order.deliveryFee === 0 ? 'FREE' : rs(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-palm-200 pt-2 text-sm font-extrabold text-palm-900">
                <span>Total Amount Due:</span>
                <span className="text-base text-coral-600 font-display">{rs(order.total)}</span>
              </div>
            </div>

            {/* Footer Slip Note */}
            <div className="text-center text-[11px] text-palm-500 border-t border-dashed border-palm-200 pt-4 space-y-1">
              <p className="font-bold text-palm-800">100% Fresh & Authentic Guarantee</p>
              <p>Keep raw coconut items chilled between 2°C – 4°C.</p>
              <p className="text-[10px]">Thank you for supporting sustainable coconut farming in Pakistan!</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons */}
        <div className="flex items-center justify-between border-t border-palm-200 px-6 py-3.5 bg-white">
          <span className="text-xs text-palm-500">Click &quot;Print / Save PDF&quot; to download receipt file.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-ghost py-2 px-4 text-xs font-bold"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary py-2 px-6 text-xs font-bold shadow-soft flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Save PDF / Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
