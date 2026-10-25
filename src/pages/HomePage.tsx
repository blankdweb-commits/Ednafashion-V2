import React, { useState, useEffect } from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Sparkles, Clock, Flame } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useStore } from '../store/useStore';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onNavigate }) => {
  const { products } = useStore();
  const flashOffers = products.filter((p) => p.sale_price_kobo !== null);

  // Flash Sale countdown timer simulation (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Lookbook Section (Hingees Warm Editorial Minimalism) */}
      <section className="relative min-h-[82vh] flex items-center bg-[#F7F3EB] border-b border-[#EFE8D8]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#A74520] font-bold tracking-[0.25em] text-xs uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#A74520]"></span>
              Harmattan / Resort 2026 Collection
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#231F18] leading-[1.12]">
              Quiet luxury, handcrafted in Nigeria.
            </h1>
            <p className="text-[#3D362A]/85 text-base sm:text-lg leading-relaxed max-w-lg">
              Conscious silhouettes tailored for tropical elegance. Unbleached Abeokuta linens, hand-dyed Yoruba indigo resist, and raw mulberry silks.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#231F18] text-[#FDFBF7] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#A74520] transition-colors flex items-center gap-2 shadow-sm"
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('studio')}
                className="border-2 border-[#A74520] text-[#A74520] hover:bg-[#A74520] hover:text-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F68B1E]" />
                Launch 3D Atelier
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/5] bg-[#EFE8D8] overflow-hidden shadow-xl border border-[#DFD3BC] relative group">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=80"
                alt="Ednafashion Editorial Feature"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FDFBF7]/95 backdrop-blur-xs p-4 border border-[#EFE8D8] flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#A74520]">
                    Editorial Feature
                  </p>
                  <p className="font-serif text-sm font-semibold text-[#231F18]">
                    Aso-Oke Heritage Accent Bolero
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-xs uppercase font-bold text-[#A74520] hover:underline"
                >
                  View Look
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Commercial Trust & Courier Assurance (Jumia Reliability) */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#EFE8D8] p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F7F3EB] text-[#F68B1E]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231F18]">Doorstep Delivery</h4>
              <p className="text-xs text-[#3D362A]/70">
                1–2 days in Edo (Benin, Epoma) & Delta (Warri); 3–5 days nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F7F3EB] text-[#F68B1E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231F18]">100% Authentic Nigerian Textiles</h4>
              <p className="text-xs text-[#3D362A]/70">
                Ethically hand-dyed indigo batiks and Nigerian artisanal weaves.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F7F3EB] text-[#F68B1E]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231F18]">7-Day Fit Guarantee</h4>
              <p className="text-xs text-[#3D362A]/70">
                Effortless size adjustments or exchanges on unworn pieces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive 3D Atelier Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#231F18] text-[#FDFBF7] p-8 sm:p-12 border border-[#3D362A] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <span className="text-[#F68B1E] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Three.js 3D Virtual Showroom
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Inspect tailoring, draping & finishes in 360° 3D.
            </h2>
            <p className="text-sm text-[#DFD3BC] leading-relaxed">
              Rotate our procedural tailor’s mannequin, switch between 5 authentic Nigerian fabric finishes (Adire Indigo, Terracotta Pleats, Raw Silk, Ankara, and Aso-Oke), and examine exploded tailoring seams in real time.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('studio')}
                className="bg-[#F68B1E] hover:bg-[#F68B1E]/90 text-white px-7 py-3 text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
              >
                Open 3D Fashion Studio <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="z-10 bg-[#3D362A]/80 border border-[#574D3D] p-5 max-w-xs text-xs space-y-2">
            <p className="font-bold uppercase tracking-wider text-[#F68B1E]">
              Procedural Craft Highlights
            </p>
            <p className="text-[#DFD3BC]">✓ 9-part procedural mannequin & drape geometry</p>
            <p className="text-[#DFD3BC]">✓ Studio PBR lighting with contact shadow grounding</p>
            <p className="text-[#DFD3BC]">✓ Zero external image dependencies (pure WebGL)</p>
            <p className="text-[#DFD3BC]">✓ One-click direct look bridge into shopping bag</p>
          </div>
        </div>
      </section>

      {/* 4. Jumia-Style Flash Deals Section with Countdown Timer */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-[#EFE8D8] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D92323]">
              <Flame className="w-4 h-4 fill-[#D92323]" />
              <span>Flash Sales & Limited Allocations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#231F18] mt-1">
              Harmattan Reductions
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-[#F7F3EB] px-4 py-2 border border-[#DFD3BC]">
            <Clock className="w-4 h-4 text-[#D92323]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#3D362A]">Ends In:</span>
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#231F18]">
              <span className="bg-[#231F18] text-white px-1.5 py-0.5 rounded-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-[#231F18] text-white px-1.5 py-0.5 rounded-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-[#231F18] text-white px-1.5 py-0.5 rounded-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {flashOffers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onLaunch3D={() => onNavigate('studio')}
            />
          ))}
        </div>
      </section>

      {/* 5. Complete Wardrobe Capsule Preview */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#EFE8D8]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3D362A]/80">
              The Harmattan Capsule
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#231F18] mt-1">
              Curated Wardrobe Pieces
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs uppercase font-bold tracking-widest text-[#231F18] hover:text-[#A74520] transition-colors flex items-center gap-1"
          >
            Explore All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onLaunch3D={() => onNavigate('studio')}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
