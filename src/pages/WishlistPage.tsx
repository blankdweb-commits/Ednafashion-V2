import React from 'react';
import { ArrowLeft, Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { formatKobo, calculateDiscountPercentage } from '../lib/currency';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string) => void;
  onBack: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onNavigate,
  onBack,
}) => {
  const { wishlist, products, toggleWishlist, addToCart, clearWishlist } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product: Product) => {
    const variant = product.variants.find((v) => v.stock_on_hand > 0) || product.variants[0];
    const activePrice = product.sale_price_kobo ?? product.base_price_kobo;

    addToCart({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      size: variant.size,
      color: variant.color,
      unitPriceKobo: activePrice,
      basePriceKobo: product.base_price_kobo,
      imageUrl: product.images[0],
      quantity: 1,
      stockAvailable: variant.stock_on_hand,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Header & Controls */}
      <div className="border-b border-[#EFE8D8] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D362A] hover:text-[#231F18] font-semibold mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D92323] fill-[#D92323]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#A74520]">
              Saved Garments ({wishlistedProducts.length})
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#231F18] mt-1">
            My Curated Wishlist
          </h1>
          <p className="text-xs text-[#3D362A]/70 mt-1">
            Persisted securely in your browser's local storage for your next shopping session.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-[#3D362A]/60 hover:text-[#D92323] underline font-semibold transition-colors"
          >
            Clear Entire Wishlist
          </button>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="bg-white border border-[#EFE8D8] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F7F3EB] text-[#D92323] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#231F18]">
            Your wishlist is currently empty
          </h2>
          <p className="text-xs text-[#3D362A]/70 leading-relaxed">
            Tap the heart icon on any kimono, blazer, or pleated dress across our collections to bookmark your favorite handcrafted Nigerian pieces.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-[#231F18] hover:bg-[#A74520] text-white px-6 py-3 text-xs uppercase font-bold tracking-widest transition-colors inline-flex items-center gap-2"
            >
              Explore Collections <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => {
            const activePrice = product.sale_price_kobo ?? product.base_price_kobo;
            const discountPercent = calculateDiscountPercentage(
              product.base_price_kobo,
              product.sale_price_kobo
            );
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock_on_hand, 0);

            return (
              <div
                key={product.id}
                className="bg-white border border-[#EFE8D8] shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-[#F7F3EB] overflow-hidden group">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                  />

                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-[#D92323] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                      -{discountPercent}%
                    </span>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white text-[#D92323] shadow-md hover:scale-110 transition-all"
                    title="Remove from wishlist"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('studio')}
                    className="absolute bottom-2.5 right-2.5 bg-[#231F18]/85 hover:bg-[#231F18] text-white p-1.5 backdrop-blur-xs transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-[#F68B1E]" />
                    <span>3D View</span>
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#A74520]">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-medium text-sm text-[#231F18] hover:text-[#A74520] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#3D362A]/60 line-clamp-1">
                      {product.details.fabric}
                    </p>
                  </div>

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
                    onClick={() => handleAddToCart(product)}
                    disabled={totalStock === 0}
                    className="w-full bg-[#231F18] hover:bg-[#A74520] text-white py-2.5 px-3 uppercase tracking-wider text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{totalStock === 0 ? 'Sold Out' : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
