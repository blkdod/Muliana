import { useState } from 'react';
import {
  CheckCircle2,
  FastForward,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  QrCode,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { buildWhatsAppUrl, formatRupiah } from '../data/shoes';
import type { Order, OrderStatus } from '../types/store';
import { QrisCode } from './QrisCode';
import { ShoeImage } from './ShoeImage';

interface OrdersModalProps {
  isOpen: boolean;
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onClose: () => void;
  onPayPendingOrder: (orderId: string) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onConfirmDelivered: (orderId: string, rating: number, review: string) => void;
}

const PROGRESS_STEPS: {
  status: OrderStatus;
  label: string;
}[] = [
  { status: 'confirmed', label: 'Pesanan Dibuat' },
  { status: 'packing', label: 'Dikemas' },
  { status: 'shipped', label: 'Dikirim' },
  { status: 'out_for_delivery', label: 'Diantar Kurir' },
  { status: 'delivered', label: 'Paket Tiba' },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending_payment: -1,
  confirmed: 0,
  packing: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
};

function getStatusLabel(status: OrderStatus): {
  text: string;
  tone: string;
} {
  switch (status) {
    case 'pending_payment':
      return { text: 'Menunggu Pembayaran QRIS', tone: 'text-amber-700' };
    case 'confirmed':
      return { text: 'Pesanan Dikonfirmasi', tone: 'text-zinc-900' };
    case 'packing':
      return { text: 'Sedang Dikemas di Toko', tone: 'text-zinc-900' };
    case 'shipped':
      return { text: 'Dalam Perjalanan Kurir', tone: 'text-blue-700' };
    case 'out_for_delivery':
      return { text: 'Kurir Menuju Alamat Anda', tone: 'text-rose-600' };
    case 'delivered':
      return { text: 'Paket Telah Tiba', tone: 'text-emerald-700' };
  }
}

export function OrdersModal({
  isOpen,
  orders,
  selectedOrderId,
  onSelectOrder,
  onClose,
  onPayPendingOrder,
  onAdvanceOrderStatus,
  onConfirmDelivered,
}: OrdersModalProps) {
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  if (!isOpen) return null;

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) ?? orders[0] ?? null;

  const payingOrder = orders.find((o) => o.id === payingOrderId) ?? null;

  const handleCompleteDeliveryConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    onConfirmDelivered(
      activeOrder.id,
      rating,
      review.trim() || 'Sepatu sesuai pesanan, nyaman dipakai dan pengiriman cepat.'
    );
    setReview('');
    setRating(5);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="orders-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-4">
          <div>
            <h2
              id="orders-modal-title"
              className="font-display text-lg font-bold text-zinc-950"
            >
              Pesanan Saya & Pelacakan Paket
            </h2>
            <p className="text-xs text-zinc-500">
              Pantau perjalanan sepatu Anda dari konfirmasi pesanan hingga paket
              tiba di tangan Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar pesanan"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {payingOrder ? (
            <div className="p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-zinc-950">
                  Selesaikan Pembayaran QRIS
                </h3>
                <button
                  type="button"
                  onClick={() => setPayingOrderId(null)}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                >
                  Kembali ke Pesanan
                </button>
              </div>
              <QrisCode
                orderId={payingOrder.id}
                amount={payingOrder.total}
                customerName={payingOrder.customerName}
                onConfirmPaid={() => {
                  onPayPendingOrder(payingOrder.id);
                  setPayingOrderId(null);
                }}
              />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-display text-lg font-semibold text-zinc-900">
                Belum ada pesanan
              </p>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                Pilih sepatu favorit Anda di katalog, selesaikan pembayaran QRIS
                atau COD, lalu lacak pengirimannya di sini.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Left Order List */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-200 bg-zinc-50/60 p-4 space-y-2.5 overflow-y-auto max-h-60 lg:max-h-none">
                <p className="text-xs font-semibold text-zinc-500 px-1">
                  Riwayat Pesanan ({orders.length})
                </p>
                {orders.map((order) => {
                  const isSelected = activeOrder?.id === order.id;
                  const statusMeta = getStatusLabel(order.status);
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => onSelectOrder(order.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white border-zinc-950 shadow-xs'
                          : 'bg-white/70 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-zinc-950 tabular-nums">
                          {order.id}
                        </span>
                        <span className="font-mono text-xs font-semibold text-zinc-900 tabular-nums">
                          {formatRupiah(order.total)}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold mt-1.5 ${statusMeta.tone}`}>
                        {statusMeta.text}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 truncate">
                        {order.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Right Active Order Tracker */}
              {activeOrder && (
                <div className="lg:col-span-8 p-6 space-y-6">
                  {/* Order Top Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-zinc-200">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                          {activeOrder.id}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Resi: {activeOrder.trackingNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase font-semibold text-zinc-700">
                          {activeOrder.paymentMethod}
                        </span>
                      </div>
                      <h3
                        className={`font-display text-xl font-bold mt-1.5 ${
                          getStatusLabel(activeOrder.status).tone
                        }`}
                      >
                        {getStatusLabel(activeOrder.status).text}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        Penerima: {activeOrder.customerName} ({activeOrder.phone}) ·{' '}
                        {activeOrder.address}, {activeOrder.city}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      {activeOrder.status === 'pending_payment' && (
                        <button
                          type="button"
                          onClick={() => setPayingOrderId(activeOrder.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer min-h-10"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Tampilkan QRIS & Bayar</span>
                        </button>
                      )}

                      {activeOrder.status !== 'pending_payment' &&
                        activeOrder.status !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => onAdvanceOrderStatus(activeOrder.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-rose-600 rounded-lg transition-colors cursor-pointer min-h-10"
                          >
                            <FastForward className="w-3.5 h-3.5" />
                            <span>Simulasikan Tahap Berikutnya</span>
                          </button>
                        )}
                    </div>
                  </div>

                  {/* 5-Stage Visual Delivery Stepper */}
                  <div>
                    <div className="grid grid-cols-5 gap-2">
                      {PROGRESS_STEPS.map((stepItem, index) => {
                        const currentIndex = STATUS_INDEX[activeOrder.status];
                        const isDone = currentIndex >= index;
                        const isCurrent = currentIndex === index;
                        return (
                          <div
                            key={stepItem.status}
                            className="flex flex-col items-center text-center"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                                isDone
                                  ? stepItem.status === 'delivered' && isCurrent
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-zinc-950 text-white border-zinc-950'
                                  : 'bg-white text-zinc-400 border-zinc-300'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <span
                              className={`mt-2 text-[11px] leading-tight ${
                                isCurrent
                                  ? 'font-bold text-zinc-950'
                                  : isDone
                                  ? 'font-medium text-zinc-700'
                                  : 'text-zinc-400'
                              }`}
                            >
                              {stepItem.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivered Confirmation & Review */}
                  {activeOrder.status === 'delivered' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <PackageCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-emerald-950">
                            Paket Telah Tiba di Tujuan
                          </p>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            {activeOrder.customerConfirmed
                              ? `Pesanan selesai dikonfirmasi oleh ${activeOrder.customerName}. Terima kasih telah berbelanja di Toko Muliana Shoes.`
                              : 'Paket sepatu sudah sampai di alamat Anda. Silakan konfirmasi penerimaan dan beri penilaian.'}
                          </p>
                        </div>
                      </div>

                      {activeOrder.customerConfirmed ? (
                        <div className="pt-2 border-t border-emerald-200/80 text-xs text-emerald-900">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: activeOrder.rating ?? 5 }).map(
                              (_, idx) => (
                                <Star
                                  key={idx}
                                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                                />
                              )
                            )}
                            <span className="ml-1 font-semibold">
                              Ulasan Anda tersimpan
                            </span>
                          </div>
                          {activeOrder.review && (
                            <p className="italic text-emerald-800">
                              &ldquo;{activeOrder.review}&rdquo;
                            </p>
                          )}
                        </div>
                      ) : (
                        <form
                          onSubmit={handleCompleteDeliveryConfirm}
                          className="space-y-3 pt-2 border-t border-emerald-200/80"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-950">
                              Rating Anda:
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  aria-label={`Beri ${star} bintang`}
                                  className="p-1 cursor-pointer"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-emerald-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                              placeholder="Tulis ulasan singkat (opsional)..."
                              className="flex-1 px-3.5 py-2 text-xs bg-white border border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-700 min-h-10"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-10"
                            >
                              Konfirmasi Paket Diterima
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Detailed Tracking Log */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                      <Truck className="w-4 h-4 text-zinc-500" />
                      <span>Riwayat Status Pengiriman</span>
                    </div>
                    <div className="space-y-3 border-l border-zinc-200 ml-2 pl-4">
                      {[...activeOrder.timeline].reverse().map((event, idx) => (
                        <div key={`${event.status}-${idx}`} className="relative">
                          <span
                            className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              idx === 0 ? 'bg-rose-600' : 'bg-zinc-400'
                            }`}
                          />
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-xs font-semibold text-zinc-950">
                              {event.title}
                            </p>
                            <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                              {event.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 mt-0.5">
                            {event.description}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchased Items Snapshot */}
                  <div className="border-t border-zinc-200 pt-4 space-y-3">
                    <p className="text-xs font-semibold text-zinc-900">
                      Rincian Sepatu
                    </p>
                    <div className="space-y-2.5">
                      {activeOrder.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.size}`}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-10 rounded-md bg-zinc-100 overflow-hidden shrink-0">
                              <ShoeImage
                                src={item.image}
                                alt={item.name}
                                brand={item.brand}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-zinc-500 font-mono tabular-nums">
                                Ukuran EU {item.size} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                            {formatRupiah(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-bold text-zinc-950">
                        Total:{' '}
                        <span className="font-mono text-rose-600 tabular-nums">
                          {formatRupiah(activeOrder.total)}
                        </span>
                      </div>

                      <a
                        href={buildWhatsAppUrl(
                          `Halo Admin Muliana Shoes, saya ingin menanyakan status pesanan ${activeOrder.id} (Resi: ${activeOrder.trackingNumber}) atas nama ${activeOrder.customerName}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Hubungi Admin via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
