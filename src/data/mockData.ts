import { Product, DeliveryZone, Coupon } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    category: 'Outerwear',
    name: 'Adire Indigo Linen Kimono',
    slug: 'adire-indigo-linen-kimono',
    description:
      'Handcrafted Abeokuta indigo batik on lightweight unbleached organic linen. Designed for warm tropical breezes and effortless evening layering.',
    details: {
      fabric: '100% Organic Linen with Traditional Indigo Resist Dye',
      care: 'Dry clean or gentle hand wash in cold water with mild detergent.',
      fit: 'Relaxed, flowing silhouette with wide bell sleeves.',
      origin: 'Handmade in Abeokuta & Lagos, Nigeria',
    },
    base_price_kobo: 3800000, // ₦38,000
    sale_price_kobo: 2660000, // ₦26,600 (30% OFF)
    is_featured: true,
    fabric_texture_type: 'adire',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v1-s', sku: 'AIK-S', size: 'S', color: 'Indigo Blue', stock_on_hand: 2 },
      { id: 'v1-m', sku: 'AIK-M', size: 'M', color: 'Indigo Blue', stock_on_hand: 5 },
      { id: 'v1-l', sku: 'AIK-L', size: 'L', color: 'Indigo Blue', stock_on_hand: 1 },
    ],
  },
  {
    id: 'prod-002',
    category: 'Tailoring',
    name: 'Sahara Raw Silk Structured Blazer',
    slug: 'sahara-raw-silk-structured-blazer',
    description:
      'A structured, modern double-breasted jacket tailored with raw slub silk. Built with natural horn buttons and breathable cupro lining.',
    details: {
      fabric: '100% Raw Slub Mulberry Silk',
      care: 'Specialist dry clean only.',
      fit: 'Structured shoulders with a tailored contemporary waist.',
      origin: 'Tailored in Surulere, Lagos',
    },
    base_price_kobo: 5200000, // ₦52,000
    sale_price_kobo: null,
    is_featured: true,
    fabric_texture_type: 'silk',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v2-s', sku: 'SSB-S', size: 'S', color: 'Sand Gold', stock_on_hand: 4 },
      { id: 'v2-m', sku: 'SSB-M', size: 'M', color: 'Sand Gold', stock_on_hand: 6 },
      { id: 'v2-l', sku: 'SSB-L', size: 'L', color: 'Sand Gold', stock_on_hand: 3 },
      { id: 'v2-xl', sku: 'SSB-XL', size: 'XL', color: 'Sand Gold', stock_on_hand: 2 },
    ],
  },
  {
    id: 'prod-003',
    category: 'Dresses',
    name: 'Eko Terracotta Pleated Midi Dress',
    slug: 'eko-terracotta-pleated-midi-dress',
    description:
      'Architectural accordion pleats cascading to a graceful mid-calf hemline. Fluid motion that transitions seamlessly from art gallery openings to dinner in Ikoyi.',
    details: {
      fabric: 'Crepe-textured sustainable viscose blend',
      care: 'Cold wash on gentle cycle; hang dry in shade.',
      fit: 'Fluid fit with optional matching waist sash.',
      origin: 'Designed & sewn in Lagos, Nigeria',
    },
    base_price_kobo: 3200000, // ₦32,000
    sale_price_kobo: 2400000, // ₦24,000 (25% OFF)
    is_featured: true,
    fabric_texture_type: 'pleated',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v3-xs', sku: 'ETM-XS', size: 'XS', color: 'Terracotta Earth', stock_on_hand: 3 },
      { id: 'v3-s', sku: 'ETM-S', size: 'S', color: 'Terracotta Earth', stock_on_hand: 7 },
      { id: 'v3-m', sku: 'ETM-M', size: 'M', color: 'Terracotta Earth', stock_on_hand: 1 },
      { id: 'v3-l', sku: 'ETM-L', size: 'L', color: 'Terracotta Earth', stock_on_hand: 4 },
    ],
  },
  {
    id: 'prod-004',
    category: 'Trousers',
    name: 'Zaria Wide-Leg Linen Trouser',
    slug: 'zaria-wide-leg-linen-trouser',
    description:
      'High-waisted, wide-leg trousers cut from heavy natural linen. Features deep side pockets, front knife pleats, and an elasticated back waistband for comfort.',
    details: {
      fabric: '100% Pure Nigerian-milled natural linen',
      care: 'Machine wash cold; warm iron while damp.',
      fit: 'High rise, relaxed through hip and wide leg opening.',
      origin: 'Made in Nigeria',
    },
    base_price_kobo: 2500000, // ₦25,000
    sale_price_kobo: 1875000, // ₦18,750 (25% OFF)
    is_featured: false,
    fabric_texture_type: 'silk',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v4-s', sku: 'ZWL-S', size: 'S', color: 'Ecru Linen', stock_on_hand: 2 },
      { id: 'v4-m', sku: 'ZWL-M', size: 'M', color: 'Ecru Linen', stock_on_hand: 8 },
      { id: 'v4-l', sku: 'ZWL-L', size: 'L', color: 'Ecru Linen', stock_on_hand: 4 },
    ],
  },
  {
    id: 'prod-005',
    category: 'Outerwear',
    name: 'Aso-Oke Heritage Accent Bolero',
    slug: 'aso-oke-heritage-accent-bolero',
    description:
      'Hand-woven metallic thread Aso-Oke woven by Yoruba master weavers in Iseyin, tailored into a modern boxy cropped bolero.',
    details: {
      fabric: 'Cotton, Lurex and Aso-Oke strip-weave',
      care: 'Dry clean only to protect metallic threads.',
      fit: 'Cropped boxy fit.',
      origin: 'Iseyin & Lagos, Nigeria',
    },
    base_price_kobo: 4500000, // ₦45,000
    sale_price_kobo: null,
    is_featured: true,
    fabric_texture_type: 'asooke',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v5-s', sku: 'AOB-S', size: 'S', color: 'Gold / Onyx', stock_on_hand: 2 },
      { id: 'v5-m', sku: 'AOB-M', size: 'M', color: 'Gold / Onyx', stock_on_hand: 1 },
    ],
  },
  {
    id: 'prod-006',
    category: 'Dresses',
    name: 'Oba Emerald Ankara Maxi Wrap',
    slug: 'oba-emerald-ankara-maxi-wrap',
    description:
      'Graceful floor-length wrap silhouette in premium wax-print cotton featuring geometric motifs and an adjustable sash tie.',
    details: {
      fabric: '100% Premium Dutch-wax Nigerian Printed Cotton',
      care: 'Hand wash cold inside out; warm iron.',
      fit: 'Adjustable wrap bodice with sweeping A-line skirt.',
      origin: 'Crafted in Lagos, Nigeria',
    },
    base_price_kobo: 3600000, // ₦36,000
    sale_price_kobo: 2880000, // ₦28,800 (20% OFF)
    is_featured: true,
    fabric_texture_type: 'ankara',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
    ],
    variants: [
      { id: 'v6-s', sku: 'OEM-S', size: 'S', color: 'Emerald Ankara', stock_on_hand: 4 },
      { id: 'v6-m', sku: 'OEM-M', size: 'M', color: 'Emerald Ankara', stock_on_hand: 3 },
      { id: 'v6-l', sku: 'OEM-L', size: 'L', color: 'Emerald Ankara', stock_on_hand: 2 },
    ],
  },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-edo',
    state: 'Edo State',
    name: 'Edo State (Benin City, Ekpoma / Epoma, Auchi)',
    fee_kobo: 350000, // ₦3,500
    estimated_days: '1–2 business days',
  },
  {
    id: 'zone-delta',
    state: 'Delta State',
    name: 'Delta State (Warri, Asaba, Sapele, Ughelli)',
    fee_kobo: 380000, // ₦3,800
    estimated_days: '1–2 business days',
  },
  {
    id: 'zone-lagos-mainland',
    state: 'Lagos',
    name: 'Lagos Mainland (Ikeja, Yaba, Surulere, Gbagada)',
    fee_kobo: 250000, // ₦2,500
    estimated_days: '1–2 business days',
  },
  {
    id: 'zone-lagos-island',
    state: 'Lagos',
    name: 'Lagos Island (Ikoyi, Victoria Island, Lekki & Ajah)',
    fee_kobo: 300000, // ₦3,000
    estimated_days: '1–2 business days',
  },
  {
    id: 'zone-abuja',
    state: 'Abuja FCT',
    name: 'Abuja Municipal & Environs (Garki, Wuse, Maitama)',
    fee_kobo: 450000, // ₦4,500
    estimated_days: '2–3 business days',
  },
  {
    id: 'zone-interstate',
    state: 'Other States',
    name: 'Interstate (Port Harcourt, Ibadan, Kano, Enugu, Calabar)',
    fee_kobo: 550000, // ₦5,500
    estimated_days: '3–5 business days',
  },
];

export const AVAILABLE_COUPONS: Record<string, Coupon> = {
  EDNA10: { code: 'EDNA10', type: 'percentage', value: 10, minSpendKobo: 2000000 },
  FIRSTBUY: { code: 'FIRSTBUY', type: 'fixed', value: 500000, minSpendKobo: 3000000 }, // ₦5,000 off
  FLASH20: { code: 'FLASH20', type: 'percentage', value: 20, minSpendKobo: 4000000 },
};
