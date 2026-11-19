import type { ShoeBrand, ShoeProduct, ShippingOptionId } from '../types/store';

export const WHATSAPP_NUMBER = '6285756850861';
export const WHATSAPP_DISPLAY = '+62 857-5685-0861';
export const PROMO_VIDEO_PATH = '/assets/aistudio/57063_accd8d13.mp4';

export const ALL_SIZES: number[] = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export const SIZE_GUIDE_CM: { eu: number; cm: string; fit: string }[] = [
  { eu: 34, cm: '21.5 cm', fit: 'Remaja / Kaki Kecil' },
  { eu: 35, cm: '22.0 cm', fit: 'Remaja / Kaki Kecil' },
  { eu: 36, cm: '22.5 cm', fit: 'Standar Wanita' },
  { eu: 37, cm: '23.5 cm', fit: 'Standar Wanita' },
  { eu: 38, cm: '24.0 cm', fit: 'Standar Wanita' },
  { eu: 39, cm: '24.5 cm', fit: 'Unisex' },
  { eu: 40, cm: '25.5 cm', fit: 'Unisex' },
  { eu: 41, cm: '26.0 cm', fit: 'Standar Pria' },
  { eu: 42, cm: '26.5 cm', fit: 'Standar Pria' },
  { eu: 43, cm: '27.5 cm', fit: 'Standar Pria' },
  { eu: 44, cm: '28.0 cm', fit: 'Kaki Lebar' },
  { eu: 45, cm: '29.0 cm', fit: 'Kaki Besar' },
];

export const BRANDS: ShoeBrand[] = [
  'Nike',
  'Adidas',
  'Puma',
  'New Balance',
  'Converse',
  'Vans',
];

export const SHIPPING_OPTIONS: {
  id: ShippingOptionId;
  label: string;
  eta: string;
  cost: number;
  description: string;
}[] = [
  {
    id: 'reguler',
    label: 'Pengiriman Reguler',
    eta: 'Estimasi 2–3 hari kerja',
    cost: 18000,
    description: 'Pengiriman aman dengan dus pelindung ke seluruh wilayah.',
  },
  {
    id: 'ekspres',
    label: 'Pengiriman Ekspres',
    eta: 'Estimasi 1 hari sampai',
    cost: 32000,
    description: 'Prioritas pengemasan dan pengiriman cepat langsung dari Cabang Lampu Merah Sunu.',
  },
  {
    id: 'pickup',
    label: 'Ambil di Toko (Lampu Merah Sunu)',
    eta: 'Siap diambil dalam 1 jam',
    cost: 0,
    description: 'Bebas ongkir, langsung coba dan ambil pesanan di Toko Muliana Shoes.',
  },
];

export const SHOES_CATALOG: ShoeProduct[] = [
  {
    id: 'nike-air-force-1',
    name: "Nike Air Force 1 '07 Low",
    brand: 'Nike',
    category: 'Sneakers',
    price: 489000,
    originalPrice: 589000,
    image: '/src/assets/images/shoe_nike_af1_white_1795072551224.jpg',
    colorway: 'Triple White',
    material: 'Kulit Sintetis Premium & Sol Karet Air',
    description:
      'Siluet ikonik serba putih yang mudah dipadukan untuk kuliah, kerja santai, maupun jalan sore. Bantalan empuk di bagian tumit menjaga kaki tetap nyaman sepanjang hari.',
    highlights: [
      'Lubang ventilasi depan menjaga sirkulasi udara kaki',
      'Outsole karet tebal anti-selip dan tahan lama',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.9,
    soldCount: 318,
    note: 'Terlaris',
  },
  {
    id: 'nike-dunk-low-panda',
    name: 'Nike Dunk Low Retro Panda',
    brand: 'Nike',
    category: 'Sneakers',
    price: 529000,
    originalPrice: 620000,
    image: '/src/assets/images/shoe_nike_dunk_panda_1795072551807.jpg',
    colorway: 'Black / Crisp White',
    material: 'Kulit Halus Dua Warna & Insole Busa',
    description:
      'Kombinasi kontras hitam dan putih yang selalu masuk dengan gaya kasual harian. Kerah pergelangan empuk memberi dukungan stabil tanpa membuat lecet.',
    highlights: [
      'Jahitan rapi dengan potongan low-top ringan',
      'Insole empuk untuk pemakaian harian berjam-jam',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.9,
    soldCount: 274,
    note: 'Favorit Anak Muda',
  },
  {
    id: 'nike-pegasus-41',
    name: 'Nike Pegasus 41 Road',
    brand: 'Nike',
    category: 'Running',
    price: 599000,
    originalPrice: 699000,
    image: '/src/assets/images/shoe_nike_pegasus_run_1795072551725.jpg',
    colorway: 'Cobalt Blue / Crimson',
    material: 'Engineered Mesh Breathable & Busa Responsif',
    description:
      'Dirancang untuk jogging pagi, olahraga kampus, hingga jalan cepat. Bagian atas berbahan mesh ringan membuat kaki tetap sejuk dan tidak pengap.',
    highlights: [
      'Midsole responsif meredam benturan saat berlari',
      'Upper mesh super ringan dan cepat kering',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.8,
    soldCount: 162,
  },
  {
    id: 'adidas-samba-og',
    name: 'Adidas Samba OG Classic',
    brand: 'Adidas',
    category: 'Casual',
    price: 495000,
    originalPrice: 575000,
    image: '/src/assets/images/shoe_adidas_samba_og_1795072552011.jpg',
    colorway: 'Cloud White / Core Black / Gum',
    material: 'Kulit Lembut, Suede T-Toe & Sol Gum',
    description:
      'Gaya retro terrace yang sedang naik daun. Menggabungkan kulit putih bersih, ujung suede abu lembut, dan sol karet gum klasik yang mencengkeram kuat.',
    highlights: [
      'Desain ramping yang pas di berbagai bentuk kaki',
      'Sol gum fleksibel dengan traksi mantap',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.9,
    soldCount: 342,
    note: 'Paling Dicari',
  },
  {
    id: 'adidas-ultraboost-light',
    name: 'Adidas Ultraboost Light',
    brand: 'Adidas',
    category: 'Running',
    price: 579000,
    originalPrice: 680000,
    image: '/src/assets/images/shoe_adidas_ultraboost_1795072551595.jpg',
    colorway: 'Charcoal Black / Silver',
    material: 'Rajutan Knit Elastis & Midsole Boost',
    description:
      'Sepatu lari dan jalan jauh dengan kenyamanan ekstra. Upper rajutan mengikuti kontur kaki seperti kaus kaki, dipadukan bantalan empuk yang ringan.',
    highlights: [
      'Upper knit lentur, nyaman dipakai tanpa terasa sempit',
      'Bantalan pantul lembut untuk aktivitas padat seharian',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.8,
    soldCount: 189,
  },
  {
    id: 'adidas-gazelle-bold',
    name: 'Adidas Gazelle Bold',
    brand: 'Adidas',
    category: 'Casual',
    price: 465000,
    originalPrice: 540000,
    image: '/src/assets/images/shoe_adidas_gazelle_rose_1795072551726.jpg',
    colorway: 'Dusty Rose / Cloud White / Gum',
    material: 'Suede Lembut & Platform Gum Tiga Lapis',
    description:
      'Tampil segar dengan sentuhan warna dusty rose lembut dan sol platform gum bertingkat yang memberi kesan jenjang tanpa terasa berat saat melangkah.',
    highlights: [
      'Warna lembut yang cerah dan kekinian',
      'Sol platform stabil namun tetap ringan dipakai jalan',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.9,
    soldCount: 215,
    note: 'Baru Masuk',
  },
  {
    id: 'puma-palermo-vintage',
    name: 'Puma Palermo Vintage',
    brand: 'Puma',
    category: 'Casual',
    price: 445000,
    originalPrice: 520000,
    image: '/src/assets/images/shoe_puma_palermo_cream_1795072550785.jpg',
    colorway: 'Warm Cream / Forest Green',
    material: 'Suede Halus & Outsole Karet Gum',
    description:
      'Terinspirasi gaya klasik Italia dengan perpaduan krem hangat dan hijau hutan yang elegan. Ringan, lentur, dan nyaman untuk hang out maupun kampus.',
    highlights: [
      'Kombinasi warna retro yang rapi dan mudah dipadukan',
      'Lapisan dalam lembut mengurangi gesekan tumit',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.8,
    soldCount: 158,
  },
  {
    id: 'puma-velocity-nitro-3',
    name: 'Puma Velocity Nitro 3',
    brand: 'Puma',
    category: 'Running',
    price: 535000,
    originalPrice: 630000,
    image: '/src/assets/images/shoe_puma_velocity_nitro_1795072551272.jpg',
    colorway: 'White / Crimson Flame',
    material: 'Mesh Teknis & Busa Nitro Ringan',
    description:
      'Sepatu olahraga enerjik dengan aksen merah menyala dan busa empuk berdaya pantul tinggi. Cocok untuk lari santai, gym, maupun gaya sporty harian.',
    highlights: [
      'Grip outsole kuat di jalan aspal maupun lintasan lari',
      'Bobot ringan dengan dukungan lengkungan kaki stabil',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.8,
    soldCount: 134,
  },
  {
    id: 'puma-suede-xl',
    name: 'Puma Suede XL',
    brand: 'Puma',
    category: 'Skate',
    price: 475000,
    originalPrice: 550000,
    image: '/src/assets/images/shoe_puma_suede_xl_1795072552536.jpg',
    colorway: 'Deep Navy / Off-White',
    material: 'Suede Tebal & Tali Lebar Klasik',
    description:
      'Versi chunky dari Puma Suede legendaris dengan lidah empuk dan tali lebar khas streetwear. Memberikan karakter kuat sekaligus kenyamanan maksimal.',
    highlights: [
      'Lidah dan kerah sepatu ekstra empuk',
      'Material suede navy tidak mudah terlihat kotor',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.9,
    soldCount: 147,
  },
  {
    id: 'new-balance-530-silver',
    name: 'New Balance 530 Silver',
    brand: 'New Balance',
    category: 'Running',
    price: 499000,
    originalPrice: 590000,
    image: '/src/assets/images/shoe_nb_530_silver_1795072551557.jpg',
    colorway: 'White / Metallic Silver / Navy',
    material: 'Open Mesh Sirkulasi Tinggi & Sol ABZORB',
    description:
      'Pilihan favorit untuk pemakaian jalan seharian. Bobotnya ringan, sirkulasi udara sangat baik, dan desain retro Y2K membuatnya selalu terlihat modern.',
    highlights: [
      'Sangat sejuk di kaki meski dipakai di cuaca panas',
      'Sol tebal empuk yang menopang tumit dengan baik',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.9,
    soldCount: 286,
    note: 'Stok Cepat Habis',
  },
  {
    id: 'converse-chuck-70-high',
    name: 'Converse Chuck 70 High',
    brand: 'Converse',
    category: 'Sneakers',
    price: 389000,
    originalPrice: 460000,
    image: '/src/assets/images/shoe_converse_chuck70_1795072552254.jpg',
    colorway: 'Black / Vintage Egret',
    material: 'Kanvas Tebal 12oz & Sol Karet Glossy Krem',
    description:
      'Sneakers kanvas high-top dengan jahitan kontras rapi dan bantalan insole lebih empuk dibanding seri biasa. Klasik, awet, dan ramah di kantong.',
    highlights: [
      'Kanvas tebal yang kokoh dan tidak mudah robek',
      'Sol warna krem vintage yang tidak mudah kusam',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.8,
    soldCount: 241,
  },
  {
    id: 'vans-old-skool-core',
    name: 'Vans Old Skool Core',
    brand: 'Vans',
    category: 'Skate',
    price: 379000,
    originalPrice: 445000,
    image: '/src/assets/images/shoe_vans_oldskool_1795072551474.jpg',
    colorway: 'Black / True White',
    material: 'Suede, Kanvas & Outsole Waffle',
    description:
      'Sepatu harian andalan dengan garis samping ikonik. Sol waffle karet memberikan pijakan mantap dan gaya kasual yang tidak pernah ketinggalan zaman.',
    highlights: [
      'Perpaduan suede depan dan kanvas samping yang tahan pakai',
      'Harga bersahabat untuk kualitas harian terbaik',
      'Tersedia lengkap ukuran EU 34 sampai 45',
    ],
    sizes: ALL_SIZES,
    rating: 4.8,
    soldCount: 229,
  },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
