import { create } from 'zustand';
import { CartItem, Coupon, DeliveryZone, Order, Product } from '../types';
import { AVAILABLE_COUPONS, PRODUCTS, DELIVERY_ZONES } from '../data/mockData';
import { calculateOrderTotals, validateCoupon } from '../lib/pricing';

const WISHLIST_STORAGE_KEY = 'ednafashion_wishlist';
const WAITING_MODE_STORAGE_KEY = 'ednafashion_waiting_mode';

function getInitialWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return ['prod-001', 'prod-003']; // pre-seeded wishlisted items
}

function getInitialWaitingMode(): boolean {
  try {
    const raw = sessionStorage.getItem(WAITING_MODE_STORAGE_KEY);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  // The launch page is the first page users see
  return true;
}

interface StoreState {
  // Catalog & Inventory
  products: Product[];
  updateProductStock: (variantId: string, newStock: number) => void;

  // Wishlist Feature (with localStorage persistence)
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Launch Waiting Page Mode
  isWaitingMode: boolean;
  setWaitingMode: (val: boolean) => void;
  toggleWaitingMode: () => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;

  // Coupons
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCouponCode: (code: string) => boolean;
  removeCouponCode: () => void;

  // Active Orders & Checkout
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'reference' | 'createdAt'>) => Order;
  updateOrderStatus: (
    reference: string,
    fulfillmentStatus: Order['fulfillmentStatus'],
    courierName?: string,
    trackingNumber?: string
  ) => void;

  // Reservation expiry timestamp (15-min reservation)
  reservationExpiry: number | null;
  startReservation: () => void;
  clearReservation: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  products: PRODUCTS,

  updateProductStock: (variantId, newStock) => {
    set((state) => ({
      products: state.products.map((p) => ({
        ...p,
        variants: p.variants.map((v) =>
          v.id === variantId ? { ...v, stock_on_hand: Math.max(0, newStock) } : v
        ),
      })),
    }));
  },

  // Wishlist implementation
  wishlist: getInitialWishlist(),

  toggleWishlist: (productId: string) => {
    set((state) => {
      const exists = state.wishlist.includes(productId);
      const next = exists
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return { wishlist: next };
    });
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.includes(productId);
  },

  clearWishlist: () => {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (e) {}
    set({ wishlist: [] });
  },

  // Launch Waiting Page Mode
  isWaitingMode: getInitialWaitingMode(),
  setWaitingMode: (val: boolean) => {
    try {
      sessionStorage.setItem(WAITING_MODE_STORAGE_KEY, JSON.stringify(val));
    } catch (e) {}
    set({ isWaitingMode: val });
  },
  toggleWaitingMode: () => {
    const next = !get().isWaitingMode;
    try {
      sessionStorage.setItem(WAITING_MODE_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    set({ isWaitingMode: next });
  },

  cart: [
    {
      variantId: 'v1-m',
      productId: 'prod-001',
      productName: 'Adire Indigo Linen Kimono',
      size: 'M',
      color: 'Indigo Blue',
      unitPriceKobo: 2660000,
      basePriceKobo: 3800000,
      imageUrl:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      quantity: 1,
      stockAvailable: 5,
    },
  ],
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addToCart: (newItem) => {
    set((state) => {
      const existing = state.cart.find((i) => i.variantId === newItem.variantId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + newItem.quantity, existing.stockAvailable);
        return {
          cart: state.cart.map((i) =>
            i.variantId === newItem.variantId ? { ...i, quantity: nextQty } : i
          ),
          isCartOpen: true,
        };
      }
      return {
        cart: [...state.cart, newItem],
        isCartOpen: true,
      };
    });
  },

  removeFromCart: (variantId) => {
    set((state) => ({
      cart: state.cart.filter((i) => i.variantId !== variantId),
    }));
  },

  updateCartQuantity: (variantId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(variantId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.min(quantity, i.stockAvailable) }
          : i
      ),
    }));
  },

  clearCart: () => set({ cart: [], appliedCoupon: null }),

  appliedCoupon: null,
  couponError: null,

  applyCouponCode: (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[code];
    const subtotal = get().cart.reduce((sum, item) => sum + item.unitPriceKobo * item.quantity, 0);

    const check = validateCoupon(coupon || null, subtotal);
    if (!check.valid) {
      set({ couponError: check.reason || 'Invalid coupon' });
      return false;
    }

    set({ appliedCoupon: coupon, couponError: null });
    return true;
  },

  removeCouponCode: () => set({ appliedCoupon: null, couponError: null }),

  orders: [
    {
      reference: 'EDNA-2026-8819',
      customerName: 'Chinelo Adebayo',
      customerEmail: 'chinelo@example.ng',
      customerPhone: '0802 345 6789',
      shippingAddress: '14 Admiralty Way, Lekki Phase 1, Lagos',
      deliveryZone: DELIVERY_ZONES[1],
      items: [
        {
          variantId: 'v1-m',
          productId: 'prod-001',
          productName: 'Adire Indigo Linen Kimono',
          size: 'M',
          color: 'Indigo Blue',
          unitPriceKobo: 2660000,
          basePriceKobo: 3800000,
          imageUrl:
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
          quantity: 1,
          stockAvailable: 5,
        },
      ],
      breakdown: {
        subtotalKobo: 2660000,
        discountKobo: 0,
        deliveryFeeKobo: 300000,
        taxKobo: 0,
        totalKobo: 2960000,
      },
      paymentStatus: 'paid',
      fulfillmentStatus: 'dispatched',
      courierName: 'GIG Logistics (Express)',
      trackingNumber: 'GIG-LOS-998241',
      createdAt: '2026-10-24 16:30',
    },
  ],

  createOrder: (orderData) => {
    const reference = `EDNA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...orderData,
      reference,
      createdAt: new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    set((state) => {
      const updatedProducts = state.products.map((product) => {
        const item = orderData.items.find((i) => i.productId === product.id);
        if (!item) return product;
        return {
          ...product,
          variants: product.variants.map((v) =>
            v.id === item.variantId
              ? { ...v, stock_on_hand: Math.max(0, v.stock_on_hand - item.quantity) }
              : v
          ),
        };
      });

      return {
        orders: [newOrder, ...state.orders],
        products: updatedProducts,
        cart: [],
        appliedCoupon: null,
        reservationExpiry: null,
      };
    });

    return newOrder;
  },

  updateOrderStatus: (reference, fulfillmentStatus, courierName, trackingNumber) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.reference === reference
          ? {
              ...o,
              fulfillmentStatus,
              courierName: courierName || o.courierName,
              trackingNumber: trackingNumber || o.trackingNumber,
            }
          : o
      ),
    }));
  },

  reservationExpiry: null,
  startReservation: () => {
    set({ reservationExpiry: Date.now() + 15 * 60 * 1000 });
  },
  clearReservation: () => set({ reservationExpiry: null }),
}));
