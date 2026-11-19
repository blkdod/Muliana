import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PromoHero } from './components/PromoHero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { StoreFooter } from './components/StoreFooter';
import type {
  CartItem,
  Order,
  OrderStatus,
  SessionUser,
  ShoeProduct,
  UserAccount,
} from './types/store';

const STORAGE_ACCOUNTS = 'muliana_shoes_accounts_v1';
const STORAGE_SESSION = 'muliana_shoes_session_v1';
const STORAGE_CART = 'muliana_shoes_cart_v1';
const STORAGE_ORDERS = 'muliana_shoes_orders_v1';

const DEFAULT_DEMO_ACCOUNT: UserAccount = {
  id: 'USR-DEMO-01',
  name: 'Anggi Pratama',
  email: 'pelanggan@mulianashoes.id',
  phone: '085756850861',
  address: 'Jl. Sunu Raya No. 24, Kec. Tallo',
  city: 'Makassar',
  password: 'muliana123',
};

function nowLabel(): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function getNextOrderStage(current: OrderStatus): {
  status: OrderStatus;
  title: string;
  description: string;
  location: string;
} | null {
  switch (current) {
    case 'confirmed':
      return {
        status: 'packing',
        title: 'Sedang Dikemas oleh Toko',
        description:
          'Tim Muliana Shoes memeriksa kondisi sepatu, kelengkapan ukuran, dan membungkus paket dengan dus pelindung.',
        location: 'Toko Muliana Shoes — Cabang Lampu Merah Sunu',
      };
    case 'packing':
      return {
        status: 'shipped',
        title: 'Paket Diserahkan ke Kurir & Dikirim',
        description:
          'Paket telah dijemput kurir ekspedisi dan sedang menuju pusat sortir pengiriman.',
        location: 'Hub Pengiriman Makassar Utara',
      };
    case 'shipped':
      return {
        status: 'out_for_delivery',
        title: 'Kurir Sedang Menuju Alamat Anda',
        description:
          'Paket dibawa kurir pengantaran menuju alamat penerima. Pastikan nomor WhatsApp aktif.',
        location: 'Dalam Pengantaran ke Alamat Penerima',
      };
    case 'out_for_delivery':
      return {
        status: 'delivered',
        title: 'Paket Telah Tiba',
        description:
          'Paket sepatu telah berhasil diterima di alamat tujuan. Terima kasih telah berbelanja di Muliana Shoes.',
        location: 'Alamat Penerima (Selesai)',
      };
    default:
      return null;
  }
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = loadJson<UserAccount[]>(STORAGE_ACCOUNTS, []);
    return saved.length > 0 ? saved : [DEFAULT_DEMO_ACCOUNT];
  });

  const [user, setUser] = useState<SessionUser | null>(() =>
    loadJson<SessionUser | null>(STORAGE_SESSION, null)
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadJson<CartItem[]>(STORAGE_CART, [])
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    loadJson<Order[]>(STORAGE_ORDERS, [])
  );

  const [selectedBrand, setSelectedBrand] = useState<string>('Semua');
  const [selectedProduct, setSelectedProduct] = useState<ShoeProduct | null>(
    null
  );
  const [promoCode, setPromoCode] = useState<string>('');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | null>(null);
  const [pendingActionAfterAuth, setPendingActionAfterAuth] = useState<
    'checkout' | 'orders' | null
  >(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((o) => o.userId === user.id);
  }, [orders, user]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const activeOrdersCount = useMemo(
    () =>
      userOrders.filter((o) => o.status !== 'delivered' || !o.customerConfirmed)
        .length,
    [userOrders]
  );

  const addToCart = (
    product: ShoeProduct,
    size: number,
    quantity: number = 1
  ) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: Math.min(10, next[idx].quantity + quantity),
        };
        return next;
      }
      return [...prev, { productId: product.id, size, quantity }];
    });
    showToast(`${product.name} (EU ${size}) ditambahkan ke keranjang.`);
  };

  const handleBuyNow = (
    product: ShoeProduct,
    size: number,
    quantity: number
  ) => {
    addToCart(product, size, quantity);
    if (!user) {
      setAuthReason('Masuk terlebih dahulu untuk melanjutkan pemesanan.');
      setPendingActionAfterAuth('checkout');
      setIsAuthOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const updateCartQty = (productId: string, size: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string, size: number) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  const handleRequestCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      setAuthReason(
        'Silakan masuk atau daftar akun untuk membuat pesanan dan melacak paket.'
      );
      setPendingActionAfterAuth('checkout');
      setIsAuthOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOpenOrders = () => {
    if (!user) {
      setAuthReason(
        'Masuk ke akun Anda untuk melihat riwayat pesanan dan status pengiriman.'
      );
      setPendingActionAfterAuth('orders');
      setIsAuthOpen(true);
      return;
    }
    setIsOrdersOpen(true);
  };

  const handleLoginSuccess = (loggedInUser: SessionUser) => {
    setUser(loggedInUser);
    showToast(`Selamat datang, ${loggedInUser.name}.`);
    const nextAction = pendingActionAfterAuth;
    setPendingActionAfterAuth(null);
    setAuthReason(null);
    if (nextAction === 'checkout' && cartItems.length > 0) {
      setIsCheckoutOpen(true);
    } else if (nextAction === 'orders') {
      setIsOrdersOpen(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsCheckoutOpen(false);
    setIsOrdersOpen(false);
    showToast('Anda telah berhasil keluar dari akun.');
  };

  const handleOrderCreated = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setPromoCode('');
    setSelectedOrderId(order.id);
    if (order.paymentMethod === 'cod') {
      showToast(`Pesanan ${order.id} (COD) dibuat dan siap dikemas.`);
      setIsOrdersOpen(true);
    }
  };

  const handleOrderPaid = (orderId: string) => {
    const timestamp = nowLabel();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const payLabel =
          order.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank';
        return {
          ...order,
          status: 'confirmed',
          paidAt: timestamp,
          timeline: [
            ...order.timeline,
            {
              status: 'confirmed',
              title: `Pembayaran ${payLabel} Terverifikasi`,
              description:
                'Pembayaran diterima. Pesanan diteruskan ke Toko Muliana Shoes Cabang Lampu Merah Sunu untuk dikemas.',
              timestamp,
              location: 'Toko Muliana Shoes — Cabang Lampu Merah Sunu',
            },
          ],
        };
      })
    );
    setSelectedOrderId(orderId);
    setIsOrdersOpen(true);
    showToast(`Pembayaran pesanan ${orderId} berhasil diverifikasi.`);
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    const timestamp = nowLabel();
    let updatedTitle = '';
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextStage = getNextOrderStage(order.status);
        if (!nextStage) return order;
        updatedTitle = nextStage.title;
        return {
          ...order,
          status: nextStage.status,
          deliveredAt:
            nextStage.status === 'delivered' ? timestamp : order.deliveredAt,
          timeline: [
            ...order.timeline,
            {
              status: nextStage.status,
              title: nextStage.title,
              description: nextStage.description,
              timestamp,
              location: nextStage.location,
            },
          ],
        };
      })
    );
    if (updatedTitle) {
      showToast(`Status paket diperbarui: ${updatedTitle}.`);
    }
  };

  const handleConfirmDelivered = (
    orderId: string,
    rating: number,
    review: string
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              customerConfirmed: true,
              rating,
              review,
            }
          : order
      )
    );
    showToast('Terima kasih! Penerimaan paket dan ulasan Anda telah tersimpan.');
  };

  const handleExploreBrand = (brand: string) => {
    setSelectedBrand(brand);
    const section = document.getElementById('katalog');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900">
      <Navbar
        user={user}
        cartCount={cartCount}
        activeOrdersCount={activeOrdersCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => {
          setAuthReason(null);
          setPendingActionAfterAuth(null);
          setIsAuthOpen(true);
        }}
        onOpenOrders={handleOpenOrders}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <PromoHero onExploreBrand={handleExploreBrand} />

        <ProductCatalog
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onQuickAdd={(product, size) => addToCart(product, size, 1)}
        />
      </main>

      <StoreFooter onOpenOrders={handleOpenOrders} />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        promoCode={promoCode}
        onApplyPromo={setPromoCode}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleRequestCheckout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        reason={authReason}
        accounts={accounts}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthReason(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        onRegisterAccount={(account) => setAccounts((prev) => [account, ...prev])}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        user={user}
        cartItems={cartItems}
        promoCode={promoCode}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
        onOrderPaid={handleOrderPaid}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        orders={userOrders}
        selectedOrderId={selectedOrderId}
        onSelectOrder={setSelectedOrderId}
        onClose={() => setIsOrdersOpen(false)}
        onPayPendingOrder={handleOrderPaid}
        onAdvanceOrderStatus={handleAdvanceOrderStatus}
        onConfirmDelivered={handleConfirmDelivered}
      />

      <WhatsAppWidget />

      {/* Subtle Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-5 z-50 max-w-sm bg-zinc-950 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-xs font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup notifikasi"
            className="text-zinc-400 hover:text-white ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
