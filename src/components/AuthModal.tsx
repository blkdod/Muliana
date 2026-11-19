import { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import type { SessionUser, UserAccount } from '../types/store';

interface AuthModalProps {
  isOpen: boolean;
  reason?: string | null;
  accounts: UserAccount[];
  onClose: () => void;
  onLoginSuccess: (user: SessionUser) => void;
  onRegisterAccount: (account: UserAccount) => void;
}

export function AuthModal({
  isOpen,
  reason,
  accounts,
  onClose,
  onLoginSuccess,
  onRegisterAccount,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Makassar');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setError('Mohon isi email dan kata sandi Anda.');
      return;
    }

    const found = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === normalizedEmail &&
        acc.password === password
    );

    if (!found) {
      setError(
        'Email atau kata sandi belum sesuai. Silakan daftar akun baru atau gunakan Masuk Cepat Pelanggan.'
      );
      return;
    }

    onLoginSuccess({
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      address: found.address,
      city: found.city,
    });
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Mohon lengkapi nama, email, nomor WhatsApp, dan kata sandi.');
      return;
    }
    if (password.trim().length < 4) {
      setError('Kata sandi minimal 4 karakter.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = accounts.some(
      (acc) => acc.email.toLowerCase() === normalizedEmail
    );
    if (exists) {
      setError('Email ini sudah terdaftar. Silakan masuk di tab Masuk.');
      return;
    }

    const newAccount: UserAccount = {
      id: `USR-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      address: address.trim() || 'Jl. Sunu No. 18, Tallo',
      city: city.trim() || 'Makassar',
      password: password.trim(),
    };

    onRegisterAccount(newAccount);
    onLoginSuccess({
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      address: newAccount.address,
      city: newAccount.city,
    });
    onClose();
  };

  const handleDemoLogin = () => {
    const demo = accounts[0];
    if (!demo) return;
    onLoginSuccess({
      id: demo.id,
      name: demo.name,
      email: demo.email,
      phone: demo.phone,
      address: demo.address,
      city: demo.city,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2
              id="auth-modal-title"
              className="font-display text-xl font-bold text-zinc-950"
            >
              {mode === 'login'
                ? 'Masuk ke Muliana Shoes'
                : 'Daftar Akun Pelanggan'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {reason ||
                'Simpan keranjang, bayar dengan QRIS, dan pantau pengiriman paket Anda.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela login"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Segmented Mode Switch */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-11"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-11"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer min-h-11"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2.5 text-zinc-400">atau</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer min-h-10"
              >
                Masuk Cepat dengan Akun Pelanggan (Anggi Pratama)
              </button>
              <p className="text-[11px] text-center text-zinc-500 font-mono">
                pelanggan@mulianashoes.id / muliana123
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Siti Rahmawati"
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0857xxxxxxxx"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Alamat Pengiriman
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jalan, nomor rumah, RT/RW"
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Makassar"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 4 karakter"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 min-h-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer min-h-11 mt-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar & Masuk Sekarang</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
