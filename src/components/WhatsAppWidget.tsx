import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from '../data/shoes';

const QUICK_PROMPTS = [
  'Halo Admin, apakah stok Nike / Adidas / Puma ukuran 34–45 ready?',
  'Halo, saya mau tanya cara pembayaran QRIS dan ongkir ke alamat saya.',
  'Halo, jam buka Toko Muliana Shoes Cabang Lampu Merah Sunu hari ini jam berapa?',
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    'Halo Admin Toko Muliana Shoes Cabang Lampu Merah Sunu, saya ingin tanya stok sepatu.'
  );

  const sendHref = buildWhatsAppUrl(
    message.trim() ||
      'Halo Admin Toko Muliana Shoes Cabang Lampu Merah Sunu, saya ingin bertanya tentang sepatu.'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {open && (
        <div
          className="mb-3 w-[320px] sm:w-[350px] bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden"
          role="dialog"
          aria-label="Chat WhatsApp Toko Muliana Shoes"
        >
          {/* Header */}
          <div className="bg-emerald-700 text-white px-4 py-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold leading-tight">
                Admin Muliana Shoes
              </p>
              <p className="text-xs text-emerald-100 mt-0.5 font-mono tabular-nums">
                {WHATSAPP_DISPLAY} · Cabang Lampu Merah Sunu
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chat WhatsApp"
              className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-zinc-50">
            <div className="bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-700 leading-relaxed">
              Halo! Ada sepatu Nike, Adidas, Puma, atau ukuran kaki 34–45 yang
              sedang dicari? Kirim pesan langsung ke WhatsApp resmi kami.
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-zinc-500">
                Pesan Cepat:
              </p>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setMessage(prompt)}
                  className="w-full text-left text-xs text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan Anda..."
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-700 resize-none"
              />
              <a
                href={sendHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors min-h-10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim ke WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Chat WhatsApp Muliana Shoes"
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer min-h-12"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Chat WhatsApp</span>
      </button>
    </div>
  );
}
