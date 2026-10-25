import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#231F18] text-[#FDFBF7] border-t border-[#3D362A]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
        {/* Brand Column */}
        <div className="space-y-3">
          <h4 className="font-serif text-xl tracking-wider text-white">EDNAFASHION</h4>
          <p className="text-[#DFD3BC] leading-relaxed max-w-xs">
            Contemporary Nigerian womenswear and tailoring. Designed with indigenous textiles and modern architectural cuts in our Lagos studio.
          </p>
          <p className="text-[11px] text-[#C2B396]">Victoria Island & Surulere, Lagos, Nigeria.</p>
        </div>

        {/* Collections */}
        <div className="space-y-2">
          <h5 className="font-bold uppercase tracking-widest text-white mb-3">Collections</h5>
          <p>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#F68B1E] transition-colors"
            >
              Adire Linen Kimonos
            </button>
          </p>
          <p>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#F68B1E] transition-colors"
            >
              Raw Silk Blazers
            </button>
          </p>
          <p>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#F68B1E] transition-colors"
            >
              Terracotta Pleated Dresses
            </button>
          </p>
          <p>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#F68B1E] transition-colors"
            >
              Natural Linen Trousers
            </button>
          </p>
          <p>
            <button
              onClick={() => onNavigate('studio')}
              className="text-[#F68B1E] font-bold hover:underline"
            >
              Interactive 3D Atelier
            </button>
          </p>
        </div>

        {/* Customer Care */}
        <div className="space-y-2">
          <h5 className="font-bold uppercase tracking-widest text-white mb-3">Customer Service</h5>
          <p>
            <button
              onClick={() => onNavigate('track')}
              className="hover:text-[#F68B1E] transition-colors"
            >
              Shipment Tracking
            </button>
          </p>
          <p>WhatsApp Concierge: +234 (0) 802 000 3344</p>
          <p>Email: concierge@ednafashion.ng</p>
          <p>7-Day Fit & Size Adjustment Guarantee</p>
          <p>
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#C2B396] hover:text-white underline mt-2"
            >
              Admin Portal
            </button>
          </p>
        </div>

        {/* Payment & Courier Partners */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase tracking-widest text-white mb-3">Courier & Payment</h5>
          <p className="text-[#DFD3BC] leading-relaxed">
            All card transactions, USSD, and bank transfers are processed via Paystack. Logistics handled by verified couriers: GIG Logistics, Red Star Express & DHL.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-[#DFD3BC]">
            <span className="border border-[#574D3D] px-2 py-1 bg-[#3D362A]">Mastercard</span>
            <span className="border border-[#574D3D] px-2 py-1 bg-[#3D362A]">Visa</span>
            <span className="border border-[#574D3D] px-2 py-1 bg-[#3D362A]">Verve</span>
            <span className="border border-[#574D3D] px-2 py-1 bg-[#3D362A]">Paystack</span>
            <span className="border border-[#574D3D] px-2 py-1 bg-[#3D362A]">GIG Express</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3D362A] py-6 text-center text-[#C2B396] text-[11px]">
        © {new Date().getFullYear()} Ednafashion Nigeria Ltd. All Rights Reserved. Inspired by Hingees & Jumia.
      </div>
    </footer>
  );
};
