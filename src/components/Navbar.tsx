import { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  User,
  LogOut,
  Package,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import type { SessionUser } from '../types/store';

interface NavbarProps {
  user: SessionUser | null;
  cartCount: number;
  activeOrdersCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  cartCount,
  activeOrdersCount,
  onOpenCart,
  onOpenAuth,
  onOpenOrders,
  onLogout,
}: NavbarProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = user ? user.name.trim().split(' ')[0] : '';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#beranda"
          className="font-display text-xl font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 rounded"
        >
          Muliana Shoes
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
          aria-label="Navigasi utama"
        >
          <a
            href="#beranda"
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-900"
          >
            Video Promo
          </a>
          <a
            href="#katalog"
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-900"
          >
            Katalog Sepatu
          </a>
          <button
            type="button"
            onClick={onOpenOrders}
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-900 cursor-pointer"
          >
            Pesanan Saya
            {activeOrdersCount > 0 ? ` (${activeOrdersCount})` : ''}
          </button>
          <a
            href="#lokasi"
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-900"
          >
            Lokasi Toko
          </a>
        </nav>

        {/* Zone 3: Cart & Account Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Buka keranjang belanja (${cartCount} item)`}
            className="relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-10"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="font-mono text-xs font-semibold tabular-nums text-rose-600">
              {cartCount}
            </span>
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-10"
              >
                <User className="w-4 h-4 text-zinc-700" />
                <span className="max-w-[100px] truncate">{firstName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 bg-white border border-zinc-200 rounded-xl shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2.5 border-b border-zinc-100">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer text-left"
                  >
                    <Package className="w-4 h-4 text-zinc-500" />
                    <span>Pesanan & Lacak Paket</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-10"
            >
              Masuk
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Menu navigasi"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1">
          <a
            href="#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
          >
            Video Promo
          </a>
          <a
            href="#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
          >
            Katalog Sepatu
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrders();
            }}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg cursor-pointer"
          >
            Pesanan Saya{activeOrdersCount > 0 ? ` (${activeOrdersCount})` : ''}
          </button>
          <a
            href="#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
          >
            Lokasi Toko
          </a>
          {user && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
            >
              Keluar ({firstName})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
