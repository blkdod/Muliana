import { useRef, useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import {
  PROMO_VIDEO_PATH,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
} from '../data/shoes';

interface PromoHeroProps {
  onExploreBrand: (brand: string) => void;
}

export function PromoHero({ onExploreBrand }: PromoHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const replayVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
  };

  const waPromoHref = buildWhatsAppUrl(
    'Halo Admin Toko Muliana Shoes Cabang Lampu Merah Sunu, saya baru melihat video promosinya dan ingin tanya koleksi sepatu yang tersedia.'
  );

  return (
    <section
      id="beranda"
      className="bg-white border-b border-zinc-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Storefront Lead */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-sm font-medium text-rose-600">
              Toko Muliana Shoes · Cabang Lampu Merah Sunu
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-zinc-950 leading-[1.08] max-w-2xl">
              Sepatu keren dan nyaman, harga tetap bersahabat.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
              Temukan pilihan lengkap dari Nike, Adidas, Puma, New Balance,
              Converse, hingga Vans dalam ukuran kaki lengkap{' '}
              <span className="font-semibold text-zinc-900">EU 34–45</span>.
              Pesan online dengan pembayaran QRIS instan dan pantau paket
              langsung hingga tiba di rumah Anda.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#katalog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Belanja Koleksi Sepatu</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={waPromoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-zinc-900 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>
            </div>

            {/* Quiet Unboxed Storefront Guarantees */}
            <div className="pt-6 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl">
              <div>
                <p className="font-display text-xl font-bold text-zinc-950 tabular-nums">
                  12+ Model
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Nike, Adidas, Puma & lainnya
                </p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-zinc-950 tabular-nums">
                  EU 34 – 45
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Ukuran lengkap anak hingga dewasa
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-display text-xl font-bold text-zinc-950">
                  QRIS & COD
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Lacak pesanan hingga paket tiba
                </p>
              </div>
            </div>

            {/* Quick Brand Jump Links */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-zinc-500">
              <span>Merek pilihan:</span>
              {(['Nike', 'Adidas', 'Puma'] as const).map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onExploreBrand(brand)}
                  className="font-semibold text-zinc-800 hover:text-rose-600 underline underline-offset-4 decoration-zinc-300 hover:decoration-rose-600 transition-colors cursor-pointer"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Official Promo Video Only (No Storyboard Section) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-[320px] sm:max-w-[340px]">
              <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-lg aspect-[9/16]">
                <video
                  ref={videoRef}
                  src={PROMO_VIDEO_PATH}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Center Play Overlay when paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Putar video promosi Muliana Shoes"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/25 to-transparent transition-opacity cursor-pointer group"
                  >
                    <span className="w-16 h-16 rounded-full bg-white/95 text-rose-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 fill-rose-600 ml-1" />
                    </span>
                    <span className="mt-3 text-sm font-semibold text-white drop-shadow">
                      Putar Video Promosi
                    </span>
                  </button>
                )}

                {/* Bottom Measured Contrast Scrim Controls */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3.5 pt-10 flex items-center justify-between gap-2">
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      Video Promosi Muliana Shoes
                    </p>
                    <p className="text-[11px] text-zinc-300 truncate">
                      Cabang Lampu Merah Sunu
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
                      className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
                      className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={replayVideo}
                      aria-label="Putar ulang video"
                      className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
