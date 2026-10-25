import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatKobo } from '../lib/currency';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCouponCode,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const subtotalKobo = cart.reduce(
    (sum, item) => sum + item.unitPriceKobo * item.quantity,
    0
  );

  let discountKobo = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountKobo = Math.round((subtotalKobo * appliedCoupon.value) / 100);
    } else {
      discountKobo = Math.min(appliedCoupon.value, subtotalKobo);
    }
  }

  const finalTotalKobo = Math.max(0, subtotalKobo - discountKobo);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    if (applyCouponCode(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-[#231F18]/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EFE8D8] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#EFE8D8] flex items-center justify-between bg-[#FDFBF7]">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#231F18]">
                Shopping Bag ({cart.length})
              </h2>
              <p className="text-[11px] text-[#3D362A]/70">Studio items pre-reserved</p>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#3D362A] hover:text-[#231F18] transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F7F3EB]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="font-serif text-lg text-[#231F18]">Your bag is currently empty.</p>
                <p className="text-xs text-[#3D362A]/70 mt-1 max-w-xs">
                  Discover contemporary silhouettes crafted with indigenous Nigerian textiles.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-[#231F18] text-[#FDFBF7] text-xs uppercase tracking-widest font-semibold hover:bg-[#A74520] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-24 object-cover object-top bg-[#F7F3EB] border border-[#EFE8D8]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-[#231F18] leading-snug">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-[#3D362A]/40 hover:text-[#D92323] p-0.5 ml-2"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#3D362A]/70 mt-0.5">
                        Size: <span className="font-semibold text-[#231F18]">{item.size}</span> • Color:{' '}
                        {item.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#DFD3BC]">
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-[#3D362A] hover:bg-[#F7F3EB]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-semibold text-[#231F18]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-[#3D362A] hover:bg-[#F7F3EB]"
                          disabled={item.quantity >= item.stockAvailable}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#231F18]">
                          {formatKobo(item.unitPriceKobo * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#EFE8D8] bg-[#FDFBF7] space-y-4">
              {/* Coupon Form with Suggestions */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#3D362A]/50 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. EDNA10)"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase tracking-wider border border-[#DFD3BC] bg-white focus:outline-none focus:border-[#231F18]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3D362A] text-[#FDFBF7] text-xs uppercase font-semibold hover:bg-[#231F18] transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Coupon Suggestions pills */}
              {!appliedCoupon && (
                <div className="flex items-center gap-1.5 text-[10px] text-[#3D362A]/80">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => applyCouponCode('EDNA10')}
                    className="underline font-bold text-[#A74520]"
                  >
                    EDNA10 (10% off)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => applyCouponCode('FIRSTBUY')}
                    className="underline font-bold text-[#A74520]"
                  >
                    FIRSTBUY (₦5,000 off)
                  </button>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-green-50 text-green-800 text-xs px-3 py-1.5 border border-green-200">
                  <span>
                    Coupon <b>{appliedCoupon.code}</b> active!
                  </span>
                  <button
                    onClick={removeCouponCode}
                    className="underline font-medium text-xs text-green-900"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p className="text-xs text-[#D92323]">{couponError}</p>}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#3D362A] border-t border-[#EFE8D8] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#231F18]">{formatKobo(subtotalKobo)}</span>
                </div>
                {discountKobo > 0 && (
                  <div className="flex justify-between text-[#D92323] font-medium">
                    <span>Discount</span>
                    <span>-{formatKobo(discountKobo)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#231F18] pt-2 border-t border-[#EFE8D8]">
                  <span>Estimated Total</span>
                  <span>{formatKobo(finalTotalKobo)}</span>
                </div>
              </div>

              {/* Express Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#F68B1E] hover:bg-[#F68B1E]/90 text-white font-bold py-3.5 px-4 uppercase tracking-wider text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#3D362A]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                <span>Encrypted Paystack checkout & 15-min reservation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
