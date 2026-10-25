import React from 'react';
import { formatKobo, calculateDiscountPercentage } from '../lib/currency';
import { Product } from '../types';
import { Sparkles, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onLaunch3D?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onLaunch3D,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = calculateDiscountPercentage(
    product.base_price_kobo,
    product.sale_price_kobo
  );
  const activePrice = product.sale_price_kobo ?? product.base_price_kobo;
  const primaryImage = product.images[0];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock_on_hand, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const availableVariant = product.variants.find((v) => v.stock_on_hand > 0) || product.variants[0];
    addToCart({
      variantId: availableVariant.id,
      productId: product.id,
      productName: product.name,
      size: availableVariant.size,
      color: availableVariant.color,
      unitPriceKobo: activePrice,
      basePriceKobo: product.base_price_kobo,
      imageUrl: primaryImage,
      quantity: 1,
      stockAvailable: availableVariant.stock_on_hand,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group flex flex-col bg-white border border-[#EFE8D8] transition-all duration-300 hover:shadow-md cursor-pointer relative"
    >
      {/* Editorial Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F3EB]">
        <img
          src={primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Jumia-Style Percentage Discount Tag */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#D92323] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Heart Icon Button (Saved to localStorage) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-all ${
            isWishlisted
              ? 'bg-white text-[#D92323] shadow-md scale-110'
              : 'bg-[#231F18]/50 text-white hover:bg-white hover:text-[#D92323]'
          }`}
          title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D92323]' : ''}`} />
        </button>

        {/* Low Stock Urgency Tag */}
        {totalStock > 0 && totalStock <= 3 && (
          <span className="absolute bottom-2.5 left-2.5 bg-[#F68B1E] text-white text-[10px] font-semibold px-2 py-0.5">
            Only {totalStock} left
          </span>
        )}

        {/* 3D Atelier Quick Trigger */}
        {onLaunch3D && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLaunch3D();
            }}
            className="absolute bottom-2.5 right-2.5 bg-[#231F18]/85 hover:bg-[#231F18] text-white p-1.5 backdrop-blur-xs transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider shadow-sm"
            title="Inspect tailoring in 3D Atelier"
          >
            <Sparkles className="w-3 h-3 text-[#F68B1E]" />
            <span className="hidden sm:inline">3D View</span>
          </button>
        )}

        {totalStock === 0 && (
          <div className="absolute inset-0 bg-[#231F18]/60 flex items-center justify-center">
            <span className="bg-[#231F18] text-[#FDFBF7] text-xs uppercase tracking-widest px-3 py-1 font-semibold">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#3D362A]/70 font-semibold">
            <span>{product.category}</span>
            <span className="text-[#A74520]">{product.details.fabric.split(' ')[0]}</span>
          </div>
          <h3 className="mt-1 text-sm font-medium text-[#231F18] group-hover:text-[#A74520] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#3D362A]/60 line-clamp-1 mt-0.5">
            {product.details.origin}
          </p>
        </div>

        {/* Strikethrough & Promotional Price + Quick Add Button */}
        <div className="mt-3 pt-2 border-t border-[#F7F3EB] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#231F18]">
              {formatKobo(activePrice)}
            </span>
            {product.sale_price_kobo && (
              <span className="text-xs text-[#3D362A]/50 line-through">
                {formatKobo(product.base_price_kobo)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={totalStock === 0}
            className="p-1.5 bg-[#F7F3EB] hover:bg-[#231F18] text-[#231F18] hover:text-white transition-colors rounded-xs disabled:opacity-40"
            title="Quick add to bag"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
