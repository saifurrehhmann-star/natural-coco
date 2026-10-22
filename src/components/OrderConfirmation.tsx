import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Package,
  ChefHat,
  Truck,
  Home,
  Clock,
  MapPin,
  Phone,
  Receipt,
  Store,
  Download,
} from 'lucide-react';
import type { OrderDetails, OrderStage } from '@/types';
import { rs } from '@/utils/format';
import { cn } from '@/utils/cn';
import { OrderReceiptModal } from './OrderReceiptModal';
import { fetchOrderByRef } from '@/api';

interface Props {
  order: OrderDetails | null;
  onClose: () => void;
}

export function OrderConfirmation({ order, onClose }: Props) {
  const [stage, setStage] = useState<OrderStage>(order?.stage || 'placed');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(order);

  // Synchronize initial order
  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
      setStage(order.stage || 'placed');
    }
  }, [order]);

  // Real-time stage updates from Admin dashboard via Custom Event + 1.5s Backend Polling
  useEffect(() => {
    if (!order?.ref) return;

    // 1. Listen for local dispatched event from Admin tab
    const handleOrderEvent = (e: Event) => {
      const custom = e as CustomEvent<{ ref: string; stage: OrderStage }>;
      if (custom.detail?.ref === order.ref && custom.detail?.stage) {
        setStage(custom.detail.stage);
        setCurrentOrder((prev) => (prev ? { ...prev, stage: custom.detail.stage } : prev));
      }
    };

    window.addEventListener('natura-order-updated', handleOrderEvent);

    // 2. Poll backend every 1500ms for real-time changes
    const interval = window.setInterval(async () => {
      try {
        const fresh = await fetchOrderByRef(order.ref);
        if (fresh && fresh.stage) {
          setStage(fresh.stage);
          setCurrentOrder(fresh);
        }
      } catch {
        /* ignore polling errors */
      }
    }, 1500);

    return () => {
      window.removeEventListener('natura-order-updated', handleOrderEvent);
      window.clearInterval(interval);
    };
  }, [order?.ref]);

  if (!order) return null;
  const isPickup = order.mode === 'pickup';

  const stages = [
    { id: 'placed' as const, label: 'Placed', icon: CheckCircle2 },
    { id: 'prep' as const, label: 'Prep', icon: ChefHat },
    { id: 'transit' as const, label: isPickup ? 'Ready' : 'Transit', icon: isPickup ? Package : Truck },
    { id: 'delivered' as const, label: isPickup ? 'Picked Up' : 'Delivered', icon: isPickup ? Store : Home },
  ];
  const stageIndex = stages.findIndex((s) => s.id === stage);

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-palm-950/60 backdrop-blur-md animate-fadeIn" />
      <div className="relative w-full sm:max-w-lg max-h-[94vh] overflow-y-auto no-scrollbar rounded-t-4xl sm:rounded-4xl bg-cream-50 shadow-lift animate-sheetUp sm:animate-popIn">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <span className="h-1.5 w-12 rounded-full bg-palm-200" />
        </div>

        {/* header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-palm-700 to-palm-500 px-6 pb-8 pt-8 text-center text-cream-50">
          <span className="pointer-events-none absolute -right-6 -top-6 text-cream-200/20 animate-floaty">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7 6 4 11 4 16c0 3 2 5 5 5 4 0 8-5 8-12 0-3-2-6-5-7Z" />
            </svg>
          </span>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <CheckCircle2 size={36} className="text-white" />
          </span>
          <h2 className="mt-3 text-2xl font-extrabold">Order Confirmed</h2>
          <p className="mt-1 text-sm text-cream-200">
            {isPickup ? 'Your order is being prepared for pickup.' : 'Your coconut is on its way.'}
          </p>
          <span className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold tracking-wider backdrop-blur">
            Ref {order.ref}
          </span>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {/* tracker */}
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              {stages.map((s, i) => {
                const Icon = s.icon;
                const done = i <= stageIndex;
                const current = i === stageIndex;
                return (
                  <div key={s.id} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      {i > 0 && (
                        <span
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors duration-500',
                            i <= stageIndex ? 'bg-palm-500' : 'bg-palm-100'
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500',
                          done
                            ? 'bg-palm-600 text-white'
                            : 'bg-palm-100 text-palm-400',
                          current && 'ring-4 ring-palm-200 animate-popIn'
                        )}
                      >
                        <Icon size={18} />
                      </span>
                      {i < stages.length - 1 && (
                        <span
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors duration-500',
                            i < stageIndex ? 'bg-palm-500' : 'bg-palm-100'
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-1.5 text-[11px] font-semibold',
                        done ? 'text-palm-800' : 'text-palm-400'
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Status Card Banner */}
          <div className="mt-3.5 flex items-center justify-between rounded-2xl bg-palm-100/70 border border-palm-200 px-3.5 py-2.5 text-xs text-palm-900">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-palm-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-palm-600"></span>
              </span>
              <span className="font-bold text-[11px] text-palm-800">
                {stage === 'placed' && 'Order Received & Confirmed'}
                {stage === 'prep' && 'Kitchen Preparing Fresh Order'}
                {stage === 'transit' && (isPickup ? 'Ready for Pickup at Flagship Store' : 'Out for Express Delivery')}
                {stage === 'delivered' && (isPickup ? 'Order Collected by Customer' : 'Order Delivered Successfully')}
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-palm-600 bg-white/70 px-2 py-0.5 rounded-full border border-palm-200">
              Live Stage
            </span>
          </div>

          {/* ETA */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <InfoCard
              icon={<Clock size={18} />}
              label={isPickup ? 'Ready for pickup' : 'Estimated arrival'}
              value={order.eta}
            />
            <InfoCard
              icon={isPickup ? <Store size={18} /> : <MapPin size={18} />}
              label={isPickup ? 'Pickup store' : 'Destination'}
              value={
                isPickup
                  ? order.pickup?.name ?? 'Karachi store'
                  : order.address || '—'
              }
            />
          </div>

          {/* contact */}
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-palm-50 px-3 py-2.5 text-xs font-medium text-palm-700">
            <Phone size={14} className="text-palm-500" />
            Contact: {order.phone}
          </div>

          {/* receipt */}
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 text-palm-900">
              <Receipt size={18} className="text-palm-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Tax Invoice</h3>
            </div>
            <div className="mt-3 space-y-1 border-b border-dashed border-palm-200 pb-3 text-sm">
              {order.items.map((i) => (
                <div key={i.key} className="flex justify-between">
                  <span className="text-palm-700">
                    {i.quantity}× {i.name}
                  </span>
                  <span className="font-semibold text-palm-900">
                    {rs(i.basePrice * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-1 pt-3 text-sm">
              <Row label="Items Total" value={rs(order.itemsTotal)} />
              <Row label="GST (5%)" value={rs(order.tax)} />
              <Row
                label={isPickup ? 'Pickup' : 'Delivery Fee'}
                value={isPickup ? 'Free' : rs(order.deliveryFee)}
              />
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-palm-100 pt-2">
              <span className="font-extrabold text-palm-900">Total Paid</span>
              <span className="text-lg font-extrabold text-coral-600">{rs(order.total)}</span>
            </div>
            <p className="mt-2 text-center text-xs text-palm-500">
              Payment: {order.paymentMethod} · Placed {order.placedAt}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setReceiptOpen(true)}
              className="btn-ghost flex-1 flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              <Download size={17} className="text-coral-600" /> Save Receipt (PDF)
            </button>
            <button onClick={onClose} className="btn-primary flex-1">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <OrderReceiptModal
        order={currentOrder || order}
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft">
      <div className="flex items-center gap-1.5 text-palm-500">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-palm-900 line-clamp-2">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-palm-600">{label}</span>
      <span className="font-semibold text-palm-900">{value}</span>
    </div>
  );
}
