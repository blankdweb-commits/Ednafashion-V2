import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Clock, ArrowLeft, CheckCircle2, CreditCard, Building2, PhoneCall } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DELIVERY_ZONES } from '../data/mockData';
import { formatKobo } from '../lib/currency';
import { DeliveryZone } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderReference: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderComplete }) => {
  const {
    cart,
    appliedCoupon,
    createOrder,
    startReservation,
    reservationExpiry,
  } = useStore();

  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  const [showPaystackModal, setShowPaystackModal] = useState<boolean>(false);
  const [paystackMethod, setPaystackMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form Fields (Edo / Delta regional defaults: Benin City, Epoma, Warri)
  const [formData, setFormData] = useState({
    fullName: 'Osasere Igbinedion',
    email: 'osasere@example.ng',
    phone: '0803 123 4567',
    streetAddress: '14 Ring Road / Sapele Road',
    city: 'Benin City',
    state: 'Edo State',
    notes: 'Direct courier delivery to Benin / Epoma hub',
  });

  // Calculate Subtotal & Discounts
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

  const deliveryFeeKobo = selectedZone.fee_kobo;
  const totalAmountKobo = Math.max(0, subtotalKobo - discountKobo + deliveryFeeKobo);

  // Start 15-minute reservation when entering checkout
  useEffect(() => {
    startReservation();
  }, []);

  // 15-minute reservation timer display
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);

  useEffect(() => {
    if (!reservationExpiry) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((reservationExpiry - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [reservationExpiry]);

  const timerMin = Math.floor(secondsRemaining / 60);
  const timerSec = secondsRemaining % 60;

  const handleOpenPaystack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.streetAddress) {
      alert('Please fill in all required shipping fields.');
      return;
    }
    setShowPaystackModal(true);
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.streetAddress}, ${formData.city}, ${formData.state}`,
        deliveryZone: selectedZone,
        items: [...cart],
        breakdown: {
          subtotalKobo,
          discountKobo,
          deliveryFeeKobo,
          taxKobo: 0,
          totalKobo: totalAmountKobo,
        },
        couponCode: appliedCoupon?.code,
        paymentStatus: 'paid',
        courierName:
          selectedZone.state === 'Delta State'
            ? 'GIG Logistics (Delta Hub - Warri/Asaba)'
            : selectedZone.state === 'Lagos'
            ? 'GIG Logistics (Lagos Express)'
            : 'Red Star Express',
        trackingNumber:
          selectedZone.state === 'Delta State'
            ? `GIG-DEL-${Math.floor(100000 + Math.random() * 900000)}`
            : `GIG-LOS-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      setIsProcessing(false);
      setShowPaystackModal(false);
      onOrderComplete(newOrder.reference);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#231F18]">Your shopping bag is empty.</h2>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2.5 bg-[#231F18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#A74520] transition-colors"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D362A] hover:text-[#231F18] font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      {/* Reservation Expiry Alert Bar (Requirement 6: 15-Minute Concurrency-Safe Lock) */}
      <div className="bg-[#FFF8E7] border border-[#F68B1E]/40 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#3D362A]">
          <Clock className="w-4 h-4 text-[#F68B1E] shrink-0" />
          <span>
            <b>Inventory Reserved:</b> Items in your cart are locked for checkout. Please complete payment before timer expires.
          </span>
        </div>
        <div className="bg-[#231F18] text-[#FDFBF7] px-3 py-1 font-mono font-bold text-xs shrink-0 rounded-xs">
          {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')} remaining
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Checkout Shipping Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#EFE8D8] shadow-xs">
          <form onSubmit={handleOpenPaystack} className="space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#231F18] mb-4 pb-2 border-b border-[#EFE8D8]">
                1. Customer Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D362A] uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Amina Mohammed"
                    className="w-full border border-[#DFD3BC] p-2.5 text-xs text-[#231F18] focus:outline-none focus:border-[#231F18]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D362A] uppercase mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0802 000 0000"
                    className="w-full border border-[#DFD3BC] p-2.5 text-xs text-[#231F18] focus:outline-none focus:border-[#231F18]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#3D362A] uppercase mb-1">
                  Email Address (For e-receipt & waybill updates) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="amina@example.ng"
                  className="w-full border border-[#DFD3BC] p-2.5 text-xs text-[#231F18] focus:outline-none focus:border-[#231F18]"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#231F18] mb-4 pb-2 border-b border-[#EFE8D8]">
                2. Nigerian Delivery Address
              </h2>
              <div>
                <label className="block text-xs font-semibold text-[#3D362A] uppercase mb-1">
                  Street Address & House / Apartment Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="Plot 12, Admiralty Way, Lekki Phase 1"
                  className="w-full border border-[#DFD3BC] p-2.5 text-xs text-[#231F18] focus:outline-none focus:border-[#231F18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D362A] uppercase mb-1">
                    City / Local Govt *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-[#DFD3BC] p-2.5 text-xs text-[#231F18] focus:outline-none focus:border-[#231F18]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D362A] uppercase mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-[#DFD3BC] p-2.5 text-xs text-[#231F18] focus:outline-none focus:border-[#231F18]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Region Selection */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#231F18] mb-4 pb-2 border-b border-[#EFE8D8]">
                3. Choose Logistics Region
              </h2>
              <div className="space-y-2.5">
                {DELIVERY_ZONES.map((zone) => (
                  <label
                    key={zone.id}
                    className={`flex items-center justify-between p-3.5 border cursor-pointer transition-colors ${
                      selectedZone.id === zone.id
                        ? 'border-[#231F18] bg-[#F7F3EB]'
                        : 'border-[#EFE8D8] hover:border-[#DFD3BC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery_zone"
                        checked={selectedZone.id === zone.id}
                        onChange={() => setSelectedZone(zone)}
                        className="accent-[#231F18]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#231F18]">{zone.name}</p>
                        <p className="text-[11px] text-[#3D362A]/70">
                          Estimated transit: {zone.estimated_days}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#231F18]">
                      {formatKobo(zone.fee_kobo)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Paystack Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#F68B1E] hover:bg-[#F68B1E]/90 text-white font-bold py-4 px-6 uppercase tracking-wider text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay {formatKobo(totalAmountKobo)} with Paystack</span>
              </button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#3D362A]/70">
                <ShieldCheck className="w-4 h-4 text-green-700" />
                <span>PCI-DSS Level 1 Encrypted Payment Gateway</span>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary & Item Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#EFE8D8] shadow-xs h-fit space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#231F18] pb-2 border-b border-[#EFE8D8]">
            Order Review ({cart.length} items)
          </h2>

          <div className="divide-y divide-[#F7F3EB] max-h-80 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.variantId} className="py-3 flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-20 object-cover bg-[#F7F3EB] border border-[#EFE8D8]"
                />
                <div className="flex-1 text-xs">
                  <h4 className="font-semibold text-[#231F18]">{item.productName}</h4>
                  <p className="text-[#3D362A]/70 mt-0.5">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                  <p className="font-bold text-[#231F18] mt-2">
                    {formatKobo(item.unitPriceKobo * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EFE8D8] pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-[#3D362A]">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#231F18]">{formatKobo(subtotalKobo)}</span>
            </div>
            {discountKobo > 0 && (
              <div className="flex justify-between text-[#D92323] font-medium">
                <span>Promotional Discount ({appliedCoupon?.code})</span>
                <span>-{formatKobo(discountKobo)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#3D362A]">
              <span>Delivery Fee ({selectedZone.state})</span>
              <span className="font-semibold text-[#231F18]">{formatKobo(deliveryFeeKobo)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#231F18] pt-3 border-t border-[#EFE8D8]">
              <span>Total Payable</span>
              <span className="text-[#F68B1E]">{formatKobo(totalAmountKobo)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Inline Simulation Modal (Authentic Lagos E-Commerce Experience) */}
      {showPaystackModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-[#231F18]/70 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full border border-[#DFD3BC] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Paystack Modal Header */}
            <div className="flex justify-between items-start border-b border-[#EFE8D8] pb-3">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#F68B1E]">
                  Paystack Secure Checkout
                </p>
                <h3 className="font-serif text-lg font-bold text-[#231F18]">
                  Ednafashion Nigeria Ltd.
                </h3>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-[#231F18]">
                  {formatKobo(totalAmountKobo)}
                </span>
                <p className="text-[10px] text-[#3D362A]/60">{formData.email}</p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <button
                type="button"
                onClick={() => setPaystackMethod('card')}
                className={`p-2.5 border font-semibold flex flex-col items-center gap-1 ${
                  paystackMethod === 'card'
                    ? 'border-[#0BA4DB] bg-[#F0F9FD] text-[#0BA4DB]'
                    : 'border-[#EFE8D8] text-[#3D362A] hover:bg-[#F7F3EB]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaystackMethod('bank')}
                className={`p-2.5 border font-semibold flex flex-col items-center gap-1 ${
                  paystackMethod === 'bank'
                    ? 'border-[#0BA4DB] bg-[#F0F9FD] text-[#0BA4DB]'
                    : 'border-[#EFE8D8] text-[#3D362A] hover:bg-[#F7F3EB]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setPaystackMethod('ussd')}
                className={`p-2.5 border font-semibold flex flex-col items-center gap-1 ${
                  paystackMethod === 'ussd'
                    ? 'border-[#0BA4DB] bg-[#F0F9FD] text-[#0BA4DB]'
                    : 'border-[#EFE8D8] text-[#3D362A] hover:bg-[#F7F3EB]'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>*737# USSD</span>
              </button>
            </div>

            {/* Mock Card Form */}
            {paystackMethod === 'card' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#3D362A] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    defaultValue="5399 •••• •••• 4021"
                    className="w-full border border-[#DFD3BC] p-2 text-xs font-mono bg-[#FDFBF7]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#3D362A] mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full border border-[#DFD3BC] p-2 text-xs font-mono bg-[#FDFBF7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#3D362A] mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      defaultValue="•••"
                      className="w-full border border-[#DFD3BC] p-2 text-xs font-mono bg-[#FDFBF7]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paystackMethod === 'bank' && (
              <div className="bg-[#F0F9FD] p-3 text-xs border border-[#0BA4DB]/30 space-y-1">
                <p className="font-bold text-[#0BA4DB]">Titan Trust / Wema Virtual Account</p>
                <p className="text-[11px] text-[#3D362A]">Account: 9940182901</p>
                <p className="text-[10px] text-[#3D362A]/70">Funds will verify automatically.</p>
              </div>
            )}

            {paystackMethod === 'ussd' && (
              <div className="bg-[#FDFBF7] p-3 text-xs border border-[#EFE8D8] text-center space-y-1 font-mono">
                <p className="font-bold text-[#231F18]">GTBank / Zenith / Access</p>
                <p className="text-sm text-[#F68B1E] font-bold">*737*50*3500*819#</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={isProcessing}
                className="w-full bg-[#0BA4DB] hover:bg-[#0BA4DB]/90 text-white font-bold py-3 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Verifying Paystack Webhook...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize {formatKobo(totalAmountKobo)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPaystackModal(false)}
                disabled={isProcessing}
                className="w-full text-center text-xs text-[#3D362A]/70 hover:text-[#231F18] py-1"
              >
                Cancel and return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
