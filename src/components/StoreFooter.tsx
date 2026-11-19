import { Clock, MapPin, MessageCircle, QrCode, ShieldCheck } from 'lucide-react';
import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from '../data/shoes';

interface StoreFooterProps {
  onOpenOrders: () => void;
}

export function StoreFooter({ onOpenOrders }: StoreFooterProps) {
  const waHref = buildWhatsAppUrl(
    'Halo Admin Toko Muliana Shoes Cabang Lampu Merah Sunu, saya ingin menanyakan alamat lengkap dan koleksi sepatu terbaru.'
  );

  return (
    <footer id="lokasi" className="bg-white border-t border-zinc-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Store Info & Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-200">
          <div className="md:col-span-5 space-y-4">
            <p className="font-display text-2xl font-bold tracking-tight text-zinc-950">
              Muliana Shoes
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed max-w-md">
              Menjual berbagai macam sepatu dan sandal kekinian yang keren,
              nyaman dipakai, dan harga bersahabat. Kunjungi langsung toko kami
              atau belanja praktis secara online dengan pembayaran QRIS.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Resmi: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-zinc-950">
              Lokasi & Jam Buka
            </h3>
            <div className="space-y-2.5 text-sm text-zinc-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Toko Muliana Shoes — Cabang Lampu Merah Sunu, Makassar,
                  Sulawesi Selatan
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span>Buka Setiap Hari · 09.00 – 21.00 WITA</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-display text-sm font-bold text-zinc-950">
              Belanja Aman
            </h3>
            <div className="space-y-2.5 text-sm text-zinc-600">
              <div className="flex items-start gap-2.5">
                <QrCode className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                <span>Mendukung QRIS, Transfer Bank & COD</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                <span>Cek kualitas sebelum kirim & ukuran EU 34–45</span>
              </div>
              <button
                type="button"
                onClick={onOpenOrders}
                className="text-sm font-semibold text-zinc-900 hover:text-rose-600 underline underline-offset-4 cursor-pointer pt-1"
              >
                Lacak Status Pesanan Saya
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} Toko Muliana Shoes — Cabang Lampu Merah
            Sunu. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <a href="#beranda" className="hover:text-zinc-900">
              Video Promo
            </a>
            <span aria-hidden="true">·</span>
            <a href="#katalog" className="hover:text-zinc-900">
              Katalog Sepatu
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenOrders}
              className="hover:text-zinc-900 cursor-pointer"
            >
              Pesanan Saya
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
