import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  Copy,
  QrCode,
  Truck,
  X,
} from 'lucide-react';
import {
  SHIPPING_OPTIONS,
  SHOES_CATALOG,
  formatRupiah,
} from '../data/shoes';
import type {
  CartItem,
  Order,
  OrderItemSnapshot,
  PaymentMethod,
  SessionUser,
  ShippingOptionId,
} from '../types/store';
import { QrisCode } from './QrisCode';
import { ShoeImage } from './ShoeImage';

interface CheckoutModalProps {
  isOpen: boolean;
  user: SessionUser | null;
  cartItems: CartItem[];
  promoCode: string;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  onOrderPaid: (orderId: string) => void;
}

function nowTimeLabel(): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function CheckoutModal({
  isOpen,
  user,
  cartItems,
  promoCode,
  onClose,
  onOrderCreated,
  onOrderPaid,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Makassar');
  const [notes, setNotes] = useState('');
  const [shippingOption, setShippingOption] =
    useState<ShippingOptionId>('reguler');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setCustomerName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
      setCity(user.city || 'Makassar');
      setNotes('');
      setStep('form');
      setActiveOrder(null);
      setIsVerifying(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const snapshots: OrderItemSnapshot[] = cartItems
    .map((item) => {
      const shoe = SHOES_CATALOG.find((p) => p.id === item.productId);
      if (!shoe) return null;
      return {
        productId: shoe.id,
        name: shoe.name,
        brand: shoe.brand,
        image: shoe.image,
        size: item.size,
        quantity: item.quantity,
        price: shoe.price,
      };
    })
    .filter((x): x is OrderItemSnapshot => x !== null);

  const subtotal = snapshots.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedShipping =
    SHIPPING_OPTIONS.find((opt) => opt.id === shippingOption) ??
    SHIPPING_OPTIONS[0];
  const discount =
    promoCode.toUpperCase() === 'MULIANA10' ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount + selectedShipping.cost);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (snapshots.length === 0) return;

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MLS-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}${String(new Date().getDate()).padStart(
      2,
      '0'
    )}-${orderNum}`;
    const trackingNumber = `RESI-MLS-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    const timestamp = nowTimeLabel();

    const isCod = paymentMethod === 'cod';
    const initialOrder: Order = {
      id: orderId,
      trackingNumber,
      userId: user.id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address:
        shippingOption === 'pickup'
          ? 'Ambil Langsung — Toko Muliana Shoes Cabang Lampu Merah Sunu'
          : address.trim(),
      city: city.trim(),
      notes: notes.trim(),
      items: snapshots,
      subtotal,
      shippingCost: selectedShipping.cost,
      discount,
      total,
      paymentMethod,
      shippingOption,
      status: isCod ? 'confirmed' : 'pending_payment',
      createdAt: timestamp,
      paidAt: isCod ? undefined : undefined,
      timeline: isCod
        ? [
            {
              status: 'confirmed',
              title: 'Pesanan Dibuat (COD)',
              description:
                'Pesanan diterima dengan metode Bayar di Tempat. Tim kami segera menyiapkan sepatu Anda.',
              timestamp,
              location: 'Toko Muliana Shoes — Cabang Lampu Merah Sunu',
            },
          ]
        : [
            {
              status: 'pending_payment',
              title: 'Menunggu Pembayaran',
              description:
                paymentMethod === 'qris'
                  ? 'Silakan selesaikan pembayaran dengan scan kode QRIS Toko Muliana Shoes.'
                  : 'Silakan selesaikan transfer ke Virtual Account Toko Muliana Shoes.',
              timestamp,
              location: 'Sistem Pembayaran Muliana Shoes',
            },
          ],
    };

    onOrderCreated(initialOrder);

    if (isCod) {
      onClose();
    } else {
      setActiveOrder(initialOrder);
      setStep('payment');
    }
  };

  const handleConfirmPayment = () => {
    if (!activeOrder) return;
    setIsVerifying(true);
    window.setTimeout(() => {
      onOrderPaid(activeOrder.id);
      setIsVerifying(false);
      onClose();
    }, 650);
  };

  const vaNumber = '8801085756850861';

  const handleCopyVa = () => {
    navigator.clipboard?.writeText(vaNumber).catch(() => {});
    setCopiedVa(true);
    window.setTimeout(() => setCopiedVa(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <span className="text-rose-600">
                <QrCode className="w-5 h-5" />
              </span>
            )}
            <div>
              <h2
                id="checkout-modal-title"
                className="font-display text-lg font-bold text-zinc-950"
              >
                {step === 'form'
                  ? 'Buat Pesanan & Pembayaran'
                  : paymentMethod === 'qris'
                  ? 'Pembayaran QRIS Toko Muliana Shoes'
                  : 'Pembayaran Transfer Bank'}
              </h2>
              <p className="text-xs text-zinc-500">
                {step === 'form'
                  ? 'Lengkapi alamat pengiriman dan pilih metode pembayaran.'
                  : 'Selesaikan pembayaran agar pesanan segera dikemas dan dikirim.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup checkout"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'form' ? (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Order Summary Strip */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-zinc-700">
                  Ringkasan Sepatu ({snapshots.reduce((a, b) => a + b.quantity, 0)}{' '}
                  pasang)
                </p>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {snapshots.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-10 rounded-md bg-white border border-zinc-200 overflow-hidden shrink-0">
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
                          <p className="text-xs text-zinc-500 font-mono tabular-nums">
                            EU {item.size} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-zinc-900 shrink-0 tabular-nums">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-3.5">
                <h3 className="font-display text-base font-semibold text-zinc-950">
                  1. Data Penerima & Alamat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nama Penerima
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-11"
                    />
                  </div>
                </div>

                {shippingOption !== 'pickup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Jalan, nomor rumah, patokan"
                        className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Kota / Kecamatan
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-11"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Catatan untuk Toko / Kurir (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Tolong bungkus bubble wrap dobel / kirim sore"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                  />
                </div>
              </div>

              {/* Shipping Options */}
              <div className="space-y-3">
                <h3 className="font-display text-base font-semibold text-zinc-950">
                  2. Metode Pengiriman
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const active = shippingOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setShippingOption(opt.id)}
                        className={`p-3.5 text-left rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'border-zinc-950 bg-zinc-950 text-white'
                            : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Truck
                            className={`w-4 h-4 ${
                              active ? 'text-rose-400' : 'text-zinc-500'
                            }`}
                          />
                          <span className="font-mono text-xs font-semibold tabular-nums">
                            {opt.cost === 0 ? 'Gratis' : formatRupiah(opt.cost)}
                          </span>
                        </div>
                        <p className="text-xs font-semibold mt-2">{opt.label}</p>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            active ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {opt.eta}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h3 className="font-display text-base font-semibold text-zinc-950">
                  3. Metode Pembayaran
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-4 text-left rounded-xl border transition-colors cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'border-rose-600 bg-rose-50/70'
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode
                        className={`w-5 h-5 ${
                          paymentMethod === 'qris'
                            ? 'text-rose-600'
                            : 'text-zinc-600'
                        }`}
                      />
                      <span className="text-[11px] font-semibold text-rose-600">
                        Instan
                      </span>
                    </div>
                    <p className="text-sm font-bold text-zinc-950 mt-2">QRIS</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Scan GoPay, OVO, DANA, ShopeePay, m-Banking
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 text-left rounded-xl border transition-colors cursor-pointer ${
                      paymentMethod === 'transfer'
                        ? 'border-zinc-950 bg-zinc-50'
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-zinc-700" />
                    <p className="text-sm font-bold text-zinc-950 mt-2">
                      Transfer Bank
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Virtual Account BCA / BRI / Mandiri
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 text-left rounded-xl border transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-zinc-950 bg-zinc-50'
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-zinc-700" />
                    <p className="text-sm font-bold text-zinc-950 mt-2">
                      COD (Bayar di Tempat)
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Bayar tunai saat paket sepatu tiba
                    </p>
                  </button>
                </div>
              </div>

              {/* Price Breakdown & Submit */}
              <div className="border-t border-zinc-200 pt-5 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal Produk</span>
                  <span className="font-mono tabular-nums">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Ongkos Kirim ({selectedShipping.label})</span>
                  <span className="font-mono tabular-nums">
                    {selectedShipping.cost === 0
                      ? 'Gratis'
                      : formatRupiah(selectedShipping.cost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Promo (MULIANA10)</span>
                    <span className="font-mono tabular-nums">
                      -{formatRupiah(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Total Bayar</span>
                  <span className="font-mono text-xl text-rose-600 tabular-nums">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer min-h-12"
              >
                {paymentMethod === 'qris'
                  ? `Buat Pesanan & Tampilkan QRIS · ${formatRupiah(total)}`
                  : paymentMethod === 'transfer'
                  ? `Buat Pesanan & Lihat Nomor VA · ${formatRupiah(total)}`
                  : `Konfirmasi Pesanan COD · ${formatRupiah(total)}`}
              </button>
            </form>
          ) : activeOrder && paymentMethod === 'qris' ? (
            <QrisCode
              orderId={activeOrder.id}
              amount={activeOrder.total}
              customerName={activeOrder.customerName}
              isVerifying={isVerifying}
              onConfirmPaid={handleConfirmPayment}
              onPayLater={onClose}
            />
          ) : activeOrder ? (
            <div className="space-y-5">
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">
                    Virtual Account Bank
                  </span>
                  <span className="text-xs font-mono text-zinc-700">
                    {activeOrder.id}
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-900">
                  BCA / BRI / Mandiri Virtual Account — Toko Muliana Shoes
                </p>
                <div className="flex items-center justify-between gap-3 bg-white border border-zinc-200 rounded-lg px-4 py-3">
                  <span className="font-mono text-lg font-bold tracking-wider text-zinc-950 tabular-nums">
                    {vaNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVa}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedVa ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                  <span className="text-xs text-zinc-500">Total Transfer</span>
                  <span className="font-mono text-xl font-bold text-rose-600 tabular-nums">
                    {formatRupiah(activeOrder.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Bayar Nanti</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isVerifying}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isVerifying
                      ? 'Memverifikasi...'
                      : 'Saya Sudah Transfer'}
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
