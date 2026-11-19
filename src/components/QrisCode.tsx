import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Clock, Download, ShieldCheck, Smartphone } from 'lucide-react';
import { formatRupiah } from '../data/shoes';

interface QrisCodeProps {
  orderId: string;
  amount: number;
  customerName: string;
  onConfirmPaid: () => void;
  onPayLater?: () => void;
  isVerifying?: boolean;
}

const GRID_SIZE = 29;

function buildQrMatrix(seedInput: string): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => false)
  );
  const reserved: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => false)
  );

  const placeFinder = (startR: number, startC: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = startR + r;
        const cc = startC + c;
        if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE) continue;
        reserved[rr][cc] = true;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          matrix[rr][cc] = false;
        } else if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[rr][cc] = true;
        } else {
          matrix[rr][cc] = false;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, GRID_SIZE - 7);
  placeFinder(GRID_SIZE - 7, 0);

  // Alignment pattern at (20, 20)
  for (let r = 20; r <= 24; r++) {
    for (let c = 20; c <= 24; c++) {
      reserved[r][c] = true;
      const dr = r - 20;
      const dc = c - 20;
      matrix[r][c] =
        dr === 0 || dr === 4 || dc === 0 || dc === 4 || (dr === 2 && dc === 2);
    }
  }

  // Timing patterns
  for (let i = 8; i < GRID_SIZE - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Center quiet zone for QRIS mark
  for (let r = 12; r <= 16; r++) {
    for (let c = 12; c <= 16; c++) {
      reserved[r][c] = true;
      matrix[r][c] = false;
    }
  }

  // Deterministic PRNG seeded by orderId + amount
  let hash = 2166136261;
  for (let i = 0; i < seedInput.length; i++) {
    hash ^= seedInput.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const nextBit = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return ((hash >>> 0) % 100) < 52;
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!reserved[r][c]) {
        matrix[r][c] = nextBit();
      }
    }
  }

  return matrix;
}

export function QrisCode({
  orderId,
  amount,
  customerName,
  onConfirmPaid,
  onPayLater,
  isVerifying = false,
}: QrisCodeProps) {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const matrix = useMemo(
    () => buildQrMatrix(`ID.CO.QRIS.MULIANASHOES.${orderId}.${amount}`),
    [orderId, amount]
  );

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleDownloadQr = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QRIS-Muliana-Shoes-${orderId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {/* Official-style QRIS Header */}
        <div className="bg-zinc-950 text-white px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold tracking-tight text-lg text-white">
              QRIS
            </span>
            <span className="text-xs text-zinc-300 border-l border-zinc-700 pl-2.5">
              Standar Pembayaran Nasional
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-rose-300">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {minutes}:{seconds}
            </span>
          </div>
        </div>

        {/* Merchant Info & QR Matrix */}
        <div className="p-6 flex flex-col items-center text-center">
          <p className="text-sm font-semibold text-zinc-900 tracking-tight">
            TOKO MULIANA SHOES
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cabang Lampu Merah Sunu · NMID ID102604850861
          </p>

          <div className="mt-4 mb-3 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
            <p className="text-xs text-zinc-500">Total Pembayaran</p>
            <p className="text-2xl font-display font-bold text-rose-600 font-mono tabular-nums">
              {formatRupiah(amount)}
            </p>
          </div>

          {/* Crisp Vector QRIS Code */}
          <div className="relative p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${GRID_SIZE + 4} ${GRID_SIZE + 4}`}
              className="w-56 h-56 sm:w-60 sm:h-60"
              role="img"
              aria-label={`Kode QRIS pembayaran Toko Muliana Shoes sebesar ${formatRupiah(amount)} untuk pesanan ${orderId}`}
            >
              <rect
                width={GRID_SIZE + 4}
                height={GRID_SIZE + 4}
                fill="#FFFFFF"
              />
              {matrix.map((row, r) =>
                row.map((filled, c) =>
                  filled ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c + 2}
                      y={r + 2}
                      width={1}
                      height={1}
                      fill="#09090B"
                      rx={0.12}
                    />
                  ) : null
                )
              )}
              {/* Center QRIS badge */}
              <rect
                x={13.5}
                y={13.5}
                width={6}
                height={6}
                rx={1.1}
                fill="#E11D48"
              />
              <text
                x={16.5}
                y={17.3}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="2.2"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                QRIS
              </text>
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-zinc-500">
            <span>GoPay</span>
            <span aria-hidden="true">·</span>
            <span>OVO</span>
            <span aria-hidden="true">·</span>
            <span>DANA</span>
            <span aria-hidden="true">·</span>
            <span>ShopeePay</span>
            <span aria-hidden="true">·</span>
            <span>BCA / BRI / Mandiri Mobile</span>
          </div>

          <div className="mt-4 w-full flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-3.5">
            <span>No. Pesanan</span>
            <span className="font-mono font-medium text-zinc-900 tabular-nums">
              {orderId}
            </span>
          </div>
          <div className="mt-1.5 w-full flex items-center justify-between text-xs text-zinc-500">
            <span>Pemesan</span>
            <span className="font-medium text-zinc-900">{customerName}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-3 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
        <Smartphone className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Buka aplikasi m-Banking atau e-Wallet Anda, pilih menu{' '}
          <strong className="text-zinc-900">Scan QRIS</strong>, arahkan ke kode
          di atas, lalu tekan tombol konfirmasi setelah transaksi berhasil.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={handleDownloadQr}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-zinc-800 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Simpan QRIS
        </button>

        <button
          type="button"
          onClick={onConfirmPaid}
          disabled={isVerifying}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isVerifying
            ? 'Memverifikasi Pembayaran...'
            : 'Saya Sudah Bayar via QRIS'}
        </button>
      </div>

      {onPayLater && (
        <div className="text-center">
          <button
            type="button"
            onClick={onPayLater}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4 cursor-pointer"
          >
            Bayar nanti dan simpan di daftar Pesanan Saya
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Verifikasi otomatis ke sistem Toko Muliana Shoes</span>
      </div>
    </div>
  );
}
