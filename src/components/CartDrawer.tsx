import { useState } from 'react';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { SHOES_CATALOG, formatRupiah } from '../data/shoes';
import type { CartItem } from '../types/store';
import { ShoeImage } from './ShoeImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  promoCode: string;
  onApplyPromo: (code: string) => void;
  onUpdateQty: (productId: string, size: number, delta: number) => void;
  onRemoveItem: (productId: string, size: number) => void;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  promoCode,
  onApplyPromo,
  onUpdateQty,
  onRemoveItem,
  onClose,
  onCheckout,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const detailedItems = items
    .map((item) => {
      const product = SHOES_CATALOG.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((entry): entry is CartItem & { product: (typeof SHOES_CATALOG)[number] } => entry !== null);

  const subtotal = detailedItems.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );
  const isPromoActive = promoCode.toUpperCase() === 'MULIANA10';
  const discount = isPromoActive ? Math.round(subtotal * 0.1) : 0;
  const estimatedTotal = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromo('');
      setPromoMessage(null);
      return;
    }
    if (cleaned === 'MULIANA10') {
      onApplyPromo('MULIANA10');
      setPromoMessage('Kode MULIANA10 aktif — hemat 10% untuk pesanan ini.');
    } else {
      onApplyPromo('');
      setPromoMessage('Kode tidak dikenal. Gunakan kode MULIANA10 untuk diskon 10%.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang belanja"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-950">
              Keranjang Belanja
            </h2>
            <p className="text-xs text-zinc-500 tabular-nums">
              {detailedItems.reduce((acc, i) => acc + i.quantity, 0)} pasang
              sepatu dipilih
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-10 h-10 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {detailedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-display text-base font-semibold text-zinc-900">
                Keranjang Anda masih kosong
              </p>
              <p className="text-sm text-zinc-500 mt-1 max-w-xs">
                Pilih sepatu Nike, Adidas, Puma, atau merek favorit lainnya dari
                katalog ukuran 34–45.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Lihat Katalog
              </button>
            </div>
          ) : (
            detailedItems.map(({ product, size, quantity }) => (
              <div
                key={`${product.id}-${size}`}
                className="flex gap-4 pb-4 border-b border-zinc-100"
              >
                <div className="w-24 h-20 rounded-lg bg-[#F4F4F5] overflow-hidden shrink-0">
                  <ShoeImage
                    src={product.image}
                    alt={product.name}
                    brand={product.brand}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-semibold text-zinc-950 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5 font-mono tabular-nums">
                        Ukuran EU {size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id, size)}
                      aria-label={`Hapus ${product.name}`}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center border border-zinc-200 rounded-md">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.id, size, -1)}
                        aria-label="Kurangi jumlah"
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(product.id, size, 1)}
                        aria-label="Tambah jumlah"
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-semibold text-zinc-950 tabular-nums">
                      {formatRupiah(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {detailedItems.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50/70 space-y-4">
            {/* Promo Code */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Kode promo (coba: MULIANA10)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 min-h-10 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-zinc-900 bg-white border border-zinc-300 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer min-h-10"
                >
                  Pakai
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-xs ${
                    isPromoActive ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {promoMessage}
                </p>
              )}
            </form>

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Diskon Promo (MULIANA10)</span>
                  <span className="font-mono tabular-nums">
                    -{formatRupiah(discount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Estimasi Total</span>
                <span className="font-mono text-rose-600 tabular-nums">
                  {formatRupiah(estimatedTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer min-h-11"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
