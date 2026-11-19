import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Star, ShoppingBag, X } from 'lucide-react';
import {
  ALL_SIZES,
  BRANDS,
  SHOES_CATALOG,
  formatRupiah,
} from '../data/shoes';
import type { ShoeProduct } from '../types/store';
import { ShoeImage } from './ShoeImage';

interface ProductCatalogProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  onSelectProduct: (product: ShoeProduct) => void;
  onQuickAdd: (product: ShoeProduct, size: number) => void;
}

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export function ProductCatalog({
  selectedBrand,
  onSelectBrand,
  onSelectProduct,
  onQuickAdd,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<SortKey>('popular');

  const categories = ['Semua', 'Sneakers', 'Running', 'Casual', 'Skate'];

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = SHOES_CATALOG.filter((item) => {
      if (selectedBrand !== 'Semua' && item.brand !== selectedBrand) {
        return false;
      }
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedSize !== 'all' && !item.sizes.includes(selectedSize)) {
        return false;
      }
      if (q) {
        const match =
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.colorway.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating || b.soldCount - a.soldCount);
    } else {
      sorted.sort((a, b) => b.soldCount - a.soldCount);
    }
    return sorted;
  }, [selectedBrand, selectedCategory, selectedSize, searchQuery, sortBy]);

  const hasActiveFilter =
    selectedBrand !== 'Semua' ||
    selectedCategory !== 'Semua' ||
    selectedSize !== 'all' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    onSelectBrand('Semua');
    setSelectedCategory('Semua');
    setSelectedSize('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <section id="katalog" className="py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-zinc-200">
          <div>
            <p className="text-xs font-semibold tracking-wide text-zinc-500">
              Koleksi Toko Muliana Shoes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-1">
              Katalog Sepatu Pilihan
            </h2>
          </div>
          <p className="text-sm text-zinc-600 max-w-md">
            Seluruh model tersedia mulai ukuran kaki{' '}
            <span className="font-mono font-semibold text-zinc-900">
              34 sampai 45
            </span>
            . Klik produk untuk melihat detail bahan dan panduan ukuran.
          </p>
        </div>

        {/* Interactive Filter Controls */}
        <div className="mt-8 space-y-4">
          {/* Brand Segmented Bar */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['Semua', ...BRANDS].map((brand) => {
              const active = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onSelectBrand(brand)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-10 ${
                    active
                      ? 'bg-zinc-950 text-white'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Search, Category, Size 34-45 & Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="relative lg:col-span-5">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari merek atau model (contoh: Nike, Samba, Puma)..."
                aria-label="Cari sepatu"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 min-h-11"
              />
            </div>

            <div className="lg:col-span-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter kategori"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-zinc-900 min-h-11 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Kategori: {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <select
                value={selectedSize === 'all' ? 'all' : String(selectedSize)}
                onChange={(e) =>
                  setSelectedSize(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                aria-label="Filter ukuran kaki"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-zinc-900 min-h-11 cursor-pointer"
              >
                <option value="all">Ukuran: 34 – 45</option>
                {ALL_SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    Ukuran EU {sz}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <SlidersHorizontal className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  aria-label="Urutkan produk"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-zinc-900 min-h-11 cursor-pointer"
                >
                  <option value="popular">Urutkan: Terpopuler</option>
                  <option value="price-asc">Harga: Termurah</option>
                  <option value="price-desc">Harga: Termahal</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  title="Reset filter"
                  className="inline-flex items-center justify-center px-3 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200 rounded-lg min-h-11 cursor-pointer whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Result Count Line */}
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <span>
              Menampilkan{' '}
              <strong className="font-mono text-zinc-900 tabular-nums">
                {filteredProducts.length}
              </strong>{' '}
              dari {SHOES_CATALOG.length} model sepatu
            </span>
            {selectedSize !== 'all' && (
              <span className="font-medium text-rose-600">
                Ukuran terpilih: EU {selectedSize} siap kirim
              </span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-10 bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <p className="font-display text-lg font-semibold text-zinc-900">
              Sepatu yang dicari belum ditemukan
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Coba ubah kata kunci pencarian atau reset filter merek dan ukuran.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Tampilkan Semua Sepatu
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((shoe) => {
              const quickSize =
                selectedSize === 'all' ? 40 : selectedSize;

              return (
                <article
                  key={shoe.id}
                  className="group bg-white border border-zinc-200/90 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Uniform 4:3 Studio Product Backdrop */}
                  <button
                    type="button"
                    onClick={() => onSelectProduct(shoe)}
                    className="relative aspect-[4/3] w-full bg-[#F4F4F5] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-600"
                  >
                    <ShoeImage
                      src={shoe.image}
                      alt={`${shoe.name} — ${shoe.colorway}`}
                      brand={shoe.brand}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>

                  {/* Product Card Body (Uniform Field Order, Zero Pill Spam) */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <span className="font-semibold text-zinc-800 uppercase tracking-wider">
                          {shoe.brand}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{shoe.category}</span>
                        {shoe.note && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-rose-600 font-medium">
                              {shoe.note}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-zinc-700 shrink-0 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {shoe.rating.toFixed(1)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(shoe)}
                      className="mt-2 text-left cursor-pointer"
                    >
                      <h3 className="font-display text-lg font-semibold text-zinc-950 group-hover:text-rose-600 transition-colors leading-snug">
                        {shoe.name}
                      </h3>
                    </button>

                    <p className="text-xs text-zinc-500 mt-1">
                      {shoe.colorway} · Ukuran 34–45
                    </p>

                    <div className="mt-auto pt-4 flex items-baseline justify-between gap-3 border-t border-zinc-100">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-base font-semibold text-zinc-950 tabular-nums">
                          {formatRupiah(shoe.price)}
                        </span>
                        {shoe.originalPrice && (
                          <span className="font-mono text-xs text-zinc-400 line-through tabular-nums">
                            {formatRupiah(shoe.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500 tabular-nums">
                        {shoe.soldCount} terjual
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(shoe)}
                        className="px-3.5 py-2.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-10"
                      >
                        Pilih Ukuran
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(shoe, quickSize)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-rose-600 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-10"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>+ Keranjang ({quickSize})</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
