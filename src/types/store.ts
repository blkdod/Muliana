export type ShoeBrand =
  | 'Nike'
  | 'Adidas'
  | 'Puma'
  | 'New Balance'
  | 'Converse'
  | 'Vans';

export type ShoeCategory =
  | 'Sneakers'
  | 'Running'
  | 'Casual'
  | 'Skate';

export interface ShoeProduct {
  id: string;
  name: string;
  brand: ShoeBrand;
  category: ShoeCategory;
  price: number;
  originalPrice?: number;
  image: string;
  colorway: string;
  material: string;
  description: string;
  highlights: string[];
  sizes: number[];
  rating: number;
  soldCount: number;
  note?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface CartItem {
  productId: string;
  size: number;
  quantity: number;
}

export type PaymentMethod = 'qris' | 'transfer' | 'cod';
export type ShippingOptionId = 'reguler' | 'ekspres' | 'pickup';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'packing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderTimelineItem {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location: string;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  brand: ShoeBrand;
  image: string;
  size: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  trackingNumber: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingOption: ShippingOptionId;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  customerConfirmed?: boolean;
  rating?: number;
  review?: string;
  timeline: OrderTimelineItem[];
}
