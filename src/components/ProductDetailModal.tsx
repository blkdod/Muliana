import { useState } from 'react';
import {
  Check,
  MessageCircle,
  Minus,
  Plus,
  Ruler,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import {
  SIZE_GUIDE_CM,
  buildWhatsAppUrl,
  formatRupiah,
} from '../data/shoes';
import type { ShoeProduct } from '../types/store';
import { ShoeImage } from './ShoeImage';

interface ProductDetailModalProps {
  product: ShoeProduct | null;
  onClose: () => void;
  onAddToCart: (product: ShoeProduct, size: number, quantity: number) => void;
  onBuyNow: (product: ShoeProduct, size: number, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<number>(40);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  const waHref = buildWhatsAppUrl(
    `Halo Admin Muliana Shoes Cabang Lampu Merah Sunu, saya tertarik dengan ${product.name} (${product.colorway}) ukuran EU ${selectedSize}. Apakah stoknya tersedia?`
  );

  const selectedCm =
    SIZE_GUIDE_CM.find((item) => item.eu === selectedSize)?.cm ?? '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Left Studio Gallery & Spec */}
          <div className="md:col-span-6 bg-[#F4F4F5] p-6 sm:p-8 flex flex-col justify-between">
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F4F4F5]">
              <ShoeImage
                src={product.image}
                alt={product.name}
                brand={product.brand}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-3 border-t border-zinc-200/80 pt-5">
              <p className="text-xs font-semibold text-zinc-800">
                Keunggulan Bahan & Desain
              </p>
              <ul className="space-y-2 text-xs text-zinc-600">
                {product.highlights.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 pt-1">
                Material: <span className="text-zinc-800">{product.material}</span>
              </p>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-semibold uppercase tracking-wider text-zinc-900">
                {product.brand}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono text-zinc-700 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} ({product.soldCount} terjual)
              </span>
            </div>

            <h2
              id="product-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 mt-2 leading-tight pr-8"
            >
              {product.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Warna: {product.colorway}
            </p>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-rose-600 tabular-nums">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-sm text-zinc-400 line-through tabular-nums">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed mt-3">
              {product.description}
            </p>

            {/* Size Selector (EU 34 to 45) */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-semibold text-zinc-900">
                  Pilih Ukuran Kaki (EU 34 – 45) ·{' '}
                  <span className="font-mono text-rose-600">
                    EU {selectedSize} ({selectedCm})
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-950 underline underline-offset-4 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showSizeGuide ? 'Tutup Panduan' : 'Panduan Ukuran'}</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-sm font-mono font-medium rounded-lg border transition-colors cursor-pointer tabular-nums min-h-10 ${
                        active
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Collapsible Size Chart 34-45 */}
              {showSizeGuide && (
                <div className="mt-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg max-h-44 overflow-y-auto">
                  <p className="text-xs font-semibold text-zinc-800 mb-2">
                    Tabel Panjang Telapak Kaki (EU 34 – 45)
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono tabular-nums">
                    {SIZE_GUIDE_CM.map((row) => (
                      <div
                        key={row.eu}
                        className={`flex items-center justify-between py-1 border-b border-zinc-200/70 ${
                          row.eu === selectedSize
                            ? 'text-rose-600 font-semibold'
                            : 'text-zinc-600'
                        }`}
                      >
                        <span>EU {row.eu}</span>
                        <span>{row.cm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900">
                Jumlah Pesanan
              </span>
              <div className="inline-flex items-center border border-zinc-200 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                  className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold text-zinc-950 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Tambah jumlah"
                  className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="mt-6 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, selectedSize, quantity);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer min-h-11"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah Keranjang</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onBuyNow(product, selectedSize, quantity);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer min-h-11"
                >
                  Beli Sekarang · {formatRupiah(product.price * quantity)}
                </button>
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors min-h-10"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Stok Ukuran {selectedSize} via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
