export interface ProductVariant {
  id: string;
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  stock_on_hand: number;
}

export interface Product {
  id: string;
  category: 'Outerwear' | 'Tailoring' | 'Dresses' | 'Trousers';
  name: string;
  slug: string;
  description: string;
  details: {
    fabric: string;
    care: string;
    fit: string;
    origin: string;
  };
  base_price_kobo: number; // 1 NGN = 100 kobo
  sale_price_kobo: number | null;
  is_featured?: boolean;
  images: string[];
  variants: ProductVariant[];
  fabric_texture_type?: 'adire' | 'silk' | 'pleated' | 'ankara' | 'asooke';
}

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  size: string;
  color: string;
  unitPriceKobo: number;
  basePriceKobo: number;
  imageUrl: string;
  quantity: number;
  stockAvailable: number;
}

export interface DeliveryZone {
  id: string;
  state: string;
  name: string;
  fee_kobo: number;
  estimated_days: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10 for 10%) or kobo (e.g. 500000 for ₦5,000)
  minSpendKobo: number;
}

export interface OrderBreakdown {
  subtotalKobo: number;
  discountKobo: number;
  deliveryFeeKobo: number;
  taxKobo: number;
  totalKobo: number;
}

export interface Order {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryZone: DeliveryZone;
  items: CartItem[];
  breakdown: OrderBreakdown;
  couponCode?: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  fulfillmentStatus: 'confirmed' | 'processing' | 'packed' | 'dispatched' | 'delivered';
  courierName: string;
  trackingNumber: string;
  createdAt: string;
}
