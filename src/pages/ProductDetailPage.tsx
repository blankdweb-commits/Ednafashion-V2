import React, { useState } from 'react';
import { ArrowLeft, Clock, ShieldCheck, Truck, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { formatKobo, calculateDiscountPercentage } from '../lib/currency';
import { useStore } from '../store/useStore';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onNavigate,
}) => {
  const { addToCart, openCart } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants.find((v) => v.stock_on_hand > 0)?.id || product.variants[0].id
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const discountPercent = calculateDiscountPercentage(
    product.base_price_kobo,
    product.sale_price_kobo
  );
  const activePrice = product.sale_price_kobo ?? product.base_price_kobo;
  const isOutOfStock = !selectedVariant || selectedVariant.stock_on_hand <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      unitPriceKobo: activePrice,
      basePriceKobo: product.base_price_kobo,
      imageUrl: product.images[0],
      quantity: 1,
      stockAvailable: selectedVariant.stock_on_hand,
    });
    setToastMessage(`Added size ${selectedVariant.size} to bag!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D362A] hover:text-[#231F18] font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collections
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery Thumbnails & Primary View */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 border overflow-hidden transition-all ${
                    activeImageIndex === idx ? 'border-[#231F18] ring-1 ring-[#231F18]' : 'border-[#EFE8D8]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 aspect-[3/4] bg-[#F7F3EB] overflow-hidden border border-[#EFE8D8] relative">
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#D92323] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#A74520]">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl font-medium text-[#231F18] mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-[#3D362A]/60 mt-1">
              SKU: <span className="font-mono">{selectedVariant?.sku}</span> • {product.details.origin}
            </p>
          </div>

          {/* Pricing Row (Hingees Elegance + Jumia Commercial Breakdown) */}
          <div className="flex items-baseline gap-3 p-3.5 bg-[#F7F3EB] border border-[#EFE8D8]">
            <span className="text-2xl font-bold text-[#231F18]">
              {formatKobo(activePrice)}
            </span>
            {product.sale_price_kobo && (
              <span className="text-sm text-[#3D362A]/50 line-through">
                {formatKobo(product.base_price_kobo)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-[#D92323]">
                Save {formatKobo(product.base_price_kobo - product.sale_price_kobo!)}
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#231F18]">
                Select Size:
              </span>
              <span className="text-xs text-[#3D362A]/70 underline">
                Nigerian / UK Size Chart
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => {
                const disabled = v.stock_on_hand <= 0;
                const isSelected = v.id === selectedVariantId;
                return (
                  <button
                    key={v.id}
                    disabled={disabled}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`min-w-[48px] py-2 px-3 text-xs font-bold border transition-all ${
                      isSelected
                        ? 'border-[#231F18] bg-[#231F18] text-white shadow-xs'
                        : disabled
                        ? 'border-[#EFE8D8] bg-[#F7F3EB] text-[#C2B396] line-through cursor-not-allowed'
                        : 'border-[#DFD3BC] bg-white text-[#231F18] hover:border-[#231F18]'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>

            {/* Low-stock Urgency indicator */}
            {selectedVariant && selectedVariant.stock_on_hand > 0 && selectedVariant.stock_on_hand <= 3 && (
              <p className="mt-2.5 text-xs font-semibold text-[#F68B1E] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Only {selectedVariant.stock_on_hand} items left in stock — order soon to secure your piece.
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-[#231F18] hover:bg-[#A74520] text-white py-3.5 px-6 uppercase tracking-widest text-xs font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full bg-[#F68B1E] hover:bg-[#F68B1E]/90 text-white py-3.5 px-6 uppercase tracking-widest text-xs font-bold transition-all shadow-sm disabled:opacity-40"
            >
              Express Checkout with Paystack
            </button>

            {/* 3D Atelier Inspection Bridge Button */}
            <button
              onClick={() => onNavigate('studio')}
              className="w-full border border-[#231F18] text-[#231F18] hover:bg-[#F7F3EB] py-2.5 px-4 uppercase tracking-widest text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F68B1E]" />
              <span>Inspect Fabric & Draping in 3D Atelier</span>
            </button>

            {toastMessage && (
              <div className="bg-green-50 text-green-800 text-xs p-2.5 border border-green-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>

          {/* Description & Nigerian Origin Accordion */}
          <div className="border-t border-[#EFE8D8] pt-6 space-y-4 text-xs text-[#3D362A] leading-relaxed">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#231F18] mb-1">
                Garment Notes
              </h4>
              <p>{product.description}</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#231F18] mb-1">
                Fabric & Provenance
              </h4>
              <p>{product.details.fabric}</p>
              <p className="mt-0.5 font-semibold text-[#A74520]">{product.details.origin}</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#231F18] mb-1">
                Care Instructions
              </h4>
              <p>{product.details.care}</p>
            </div>
          </div>

          {/* Delivery & Assurance */}
          <div className="bg-[#F7F3EB] p-4 border border-[#EFE8D8] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#231F18]">
              <Truck className="w-4 h-4 text-[#F68B1E]" />
              <span>Doorstep Delivery: Lagos (1–2 days) | Interstate (3–5 days)</span>
            </div>
            <div className="flex items-center gap-2 text-[#3D362A]/80">
              <ShieldCheck className="w-4 h-4 text-[#F68B1E]" />
              <span>Includes 7-day exchange guarantee if fit is not exact.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
