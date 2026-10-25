import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, PackageCheck, Truck, Home, Search, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatKobo } from '../lib/currency';

interface OrderTrackingPageProps {
  initialReference?: string;
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialReference,
  onBack,
  onNavigate,
}) => {
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState<string>(initialReference || 'EDNA-2026-8819');
  const [activeReference, setActiveReference] = useState<string>(
    initialReference || 'EDNA-2026-8819'
  );

  const matchedOrder = orders.find(
    (o) => o.reference.toLowerCase() === activeReference.toLowerCase()
  ) || orders[0];

  const steps = [
    {
      key: 'confirmed',
      label: 'Payment Confirmed',
      desc: 'Paystack verified. Inventory committed.',
      icon: CheckCircle2,
    },
    {
      key: 'processing',
      label: 'Studio Tailoring',
      desc: 'Handcrafted in our Lagos atelier.',
      icon: Clock,
    },
    {
      key: 'packed',
      label: 'Quality Inspected & Packed',
      desc: 'Placed in branded cotton garment bag.',
      icon: PackageCheck,
    },
    {
      key: 'dispatched',
      label: 'Dispatched with Courier',
      desc: 'Waybill generated and in transit.',
      icon: Truck,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: 'Safely delivered to customer address.',
      icon: Home,
    },
  ];

  const statusOrder = ['confirmed', 'processing', 'packed', 'dispatched', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(matchedOrder?.fulfillmentStatus || 'confirmed');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveReference(searchInput.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D362A] hover:text-[#231F18] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collections
        </button>

        <button
          onClick={() => onNavigate('admin')}
          className="text-xs text-[#A74520] underline font-semibold"
        >
          Manage in Admin Portal →
        </button>
      </div>

      {/* Reference Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-4 border border-[#EFE8D8] shadow-xs flex flex-col sm:flex-row gap-3 items-center"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#3D362A]/50 absolute left-3 top-3" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Order Reference (e.g. EDNA-2026-8819)"
            className="w-full pl-9 pr-3 py-2 text-xs uppercase tracking-wider font-mono border border-[#DFD3BC] bg-[#FDFBF7] text-[#231F18] focus:outline-none focus:border-[#231F18]"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-[#231F18] text-[#FDFBF7] text-xs uppercase font-bold tracking-wider hover:bg-[#A74520] transition-colors"
        >
          Track Waybill
        </button>
      </form>

      {/* Order Status Card */}
      {matchedOrder ? (
        <div className="bg-white border border-[#EFE8D8] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE8D8]">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#A74520]">
                Shipment Tracker
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#231F18] mt-1">
                Order #{matchedOrder.reference}
              </h2>
              <p className="text-xs text-[#3D362A]/70 mt-0.5">
                Placed on {matchedOrder.createdAt} by {matchedOrder.customerName}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-green-50 text-green-800 text-xs px-2.5 py-1 border border-green-200 font-bold uppercase tracking-wider">
                {matchedOrder.paymentStatus === 'paid' ? 'Payment Verified' : 'Pending'}
              </span>
              <p className="text-xs font-semibold text-[#231F18] mt-1">
                Total: {formatKobo(matchedOrder.breakdown.totalKobo)}
              </p>
            </div>
          </div>

          {/* Courier Card (Requirement 8: Courier independent system) */}
          <div className="p-4 bg-[#F7F3EB] border border-[#EFE8D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#3D362A]/70">
                Courier Partner
              </p>
              <p className="font-bold text-[#231F18] text-sm mt-0.5">
                {matchedOrder.courierName || 'GIG Logistics'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#3D362A]/70">
                Waybill Tracking No.
              </p>
              <p className="font-mono font-bold text-[#231F18] text-sm mt-0.5">
                {matchedOrder.trackingNumber || 'GIG-LOS-998241'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#3D362A]/70">
                Destination
              </p>
              <p className="font-medium text-[#231F18] text-xs mt-0.5 line-clamp-1">
                {matchedOrder.shippingAddress}
              </p>
            </div>
          </div>

          {/* Progress Stepper Timeline */}
          <div className="pt-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#3D362A] mb-6">
              Fulfillment Journey
            </h3>
            <div className="relative border-l-2 border-[#EFE8D8] ml-4 pl-6 space-y-8">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="relative">
                    <span
                      className={`absolute -left-[33px] top-0 flex items-center justify-center w-7 h-7 rounded-full text-white text-xs ${
                        isCurrent
                          ? 'bg-[#F68B1E] ring-4 ring-[#F68B1E]/20'
                          : isCompleted
                          ? 'bg-[#231F18]'
                          : 'bg-[#DFD3BC]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? 'text-[#231F18]' : 'text-[#3D362A]/50'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-[#3D362A]/70 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items in this order */}
          <div className="border-t border-[#EFE8D8] pt-6 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#3D362A]">
              Items In This Package
            </h4>
            <div className="divide-y divide-[#F7F3EB]">
              {matchedOrder.items.map((item) => (
                <div key={item.variantId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-12 h-14 object-cover bg-[#F7F3EB] border border-[#EFE8D8]"
                    />
                    <div>
                      <p className="font-semibold text-[#231F18]">{item.productName}</p>
                      <p className="text-[11px] text-[#3D362A]/70">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#231F18]">
                    {formatKobo(item.unitPriceKobo * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#EFE8D8] p-8 text-center">
          <p className="font-serif text-lg text-[#231F18]">Order not found.</p>
          <p className="text-xs text-[#3D362A]/70 mt-1">
            Please verify the order reference number on your SMS or email receipt.
          </p>
        </div>
      )}
    </div>
  );
};
