import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Power,
  Pill,
  X,
  ChevronRight,
  ShieldCheck,
  Crown,
  ZoomIn,
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';

interface WaitingPageProps {
  onEnterStore: () => void;
}

// Decorative Monstera Leaf SVG component to replicate the template's background foliage
const MonsteraLeafSVG: React.FC<{ className?: string; opacity?: string; fill?: string }> = ({
  className = '',
  opacity = 'opacity-35',
  fill = '#59448F',
}) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} ${opacity} pointer-events-none select-none`}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M100 10 C50 10 15 50 15 100 C15 130 30 158 52 175 C50 160 52 142 60 128 C64 121 72 118 78 122 C84 126 86 134 83 141 C77 154 75 168 76 182 C84 186 92 188 100 188 C108 188 116 186 124 182 C125 168 123 154 117 141 C114 134 116 126 122 122 C128 118 136 121 140 128 C148 142 150 160 148 175 C170 158 185 130 185 100 C185 50 150 10 100 10 Z M55 60 C58 50 70 48 76 56 C82 64 80 76 72 80 C60 86 52 72 55 60 Z M145 60 C148 72 140 86 128 80 C120 76 118 64 124 56 C130 48 142 50 145 60 Z M38 95 C40 85 52 82 58 90 C63 97 61 108 53 112 C42 117 35 105 38 95 Z M162 95 C165 105 158 117 147 112 C139 108 137 97 142 90 C148 82 160 85 162 95 Z" />
    <path
      d="M100 20 L100 185"
      stroke="#43326F"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

const FOUNDER_PHOTO_PATH = '/assets/aistudio/IMG-20261025-WA0007_23548730.jpg';

export const WaitingPage: React.FC<WaitingPageProps> = ({ onEnterStore }) => {
  // 14-day countdown state initialized to 14 days
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedLaunch = localStorage.getItem('ednafashion_launch_timestamp');
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    let targetTime = storedLaunch ? parseInt(storedLaunch, 10) : 0;

    if (!targetTime || isNaN(targetTime) || targetTime <= Date.now()) {
      targetTime = Date.now() + fourteenDaysMs;
      localStorage.setItem('ednafashion_launch_timestamp', targetTime.toString());
    }

    const diff = Math.max(0, targetTime - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showChillModal, setShowChillModal] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [chillPillsTaken, setChillPillsTaken] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const stored = localStorage.getItem('ednafashion_launch_timestamp');
      const target = stored ? parseInt(stored, 10) : Date.now() + 14 * 86400000;
      const diff = Math.max(0, target - Date.now());

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubscribed(true);
  };

  const handleTakeChillPill = () => {
    setChillPillsTaken((prev) => prev + 1);
    setShowChillModal(true);
  };

  return (
    <div className="min-h-screen bg-[#9C8BD9] relative overflow-hidden flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#97E575] selection:text-[#183918]">
      {/* Background Layer: Founder photo embedded across the entire launch background with luxury tone */}
      <div
        className="absolute inset-0 bg-cover pointer-events-none opacity-40 mix-blend-overlay filter blur-[1px] transform scale-105"
        style={{
          backgroundImage: `url('${FOUNDER_PHOTO_PATH}')`,
          backgroundPosition: 'center 58%',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#5E3F92]/80 via-[#7D64B5]/65 to-[#A390D8]/75 pointer-events-none" />

      {/* Background Decorative Monstera Leaves */}
      <MonsteraLeafSVG className="absolute -top-12 -left-12 w-64 h-64 sm:w-80 sm:h-80 -rotate-45" />
      <MonsteraLeafSVG className="absolute top-1/4 -left-16 w-52 h-52 rotate-12 opacity-25" />
      <MonsteraLeafSVG className="absolute -bottom-16 -left-10 w-72 h-72 rotate-45 opacity-30" />
      <MonsteraLeafSVG className="absolute -top-16 -right-12 w-72 h-72 rotate-45" />
      <MonsteraLeafSVG className="absolute top-1/3 -right-14 w-60 h-60 -rotate-12 opacity-25" />
      <MonsteraLeafSVG className="absolute -bottom-12 -right-10 w-80 h-80 -rotate-45" />

      {/* Main Floating Rounded Card Container */}
      <div className="relative z-10 w-full max-w-6xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_25px_60px_rgba(42,22,75,0.4)] overflow-hidden border border-white/70 flex flex-col my-auto transition-all">
        {/* Card Header Nav Bar */}
        <header className="px-6 sm:px-10 py-5 sm:py-6 border-b border-gray-100/80 flex items-center justify-between">
          {/* Logo with Founder indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#1F1E24]">
                EDNAFASHION
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#97E575]" />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-[#FAF8FE] border border-[#DFD5F5] text-[#5A3E94] px-2.5 py-0.5 rounded-full">
              <Crown className="w-3 h-3 text-[#F68B1E]" />
              Founder-Owned
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            <button
              onClick={onEnterStore}
              className="hover:text-black transition-colors"
            >
              Home
            </button>
            <button
              onClick={onEnterStore}
              className="hover:text-black transition-colors"
            >
              Collections
            </button>
            <button
              onClick={onEnterStore}
              className="hover:text-black transition-colors flex items-center gap-1.5"
            >
              <span>3D Atelier</span>
              <span className="bg-[#97E575]/40 text-[#1F4A1E] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                Live
              </span>
            </button>
            <span className="text-gray-500 font-semibold text-[11px]">
              Edo, Ekpoma, Warri, Benin
            </span>
            <button
              onClick={() => {
                const el = document.getElementById('vip-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-black transition-colors text-[#8B44FF]"
            >
              VIP Access
            </button>
          </nav>

          {/* Power / Enter Store Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterStore}
              title="Unlock Live Preview Store"
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white text-gray-700 flex items-center justify-center transition-all group shadow-sm cursor-pointer"
              aria-label="Unlock live store"
            >
              <Power className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </header>

        {/* Card Body - 2 Columns */}
        <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy, Chill Pill Button & 14-Day Countdown */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Title & Copy */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#1C1A24] leading-none">
                Waiting
              </h1>

              <div>
                <p className="text-lg sm:text-xl font-bold text-[#2A2735] leading-snug">
                  We know it can be boring. But it won&apos;t take long. Pinky swear!
                </p>
              </div>
            </div>

            {/* The Iconic Pill Button from Template */}
            <div className="pt-1">
              <button
                onClick={handleTakeChillPill}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-4.5 bg-[#97E575] hover:bg-[#86DC61] active:scale-95 text-[#143B14] font-black text-sm sm:text-base tracking-widest uppercase rounded-full shadow-[0_8px_25px_rgba(151,229,117,0.55)] hover:shadow-[0_12px_30px_rgba(151,229,117,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Pill className="w-5 h-5 transition-transform group-hover:rotate-45" />
                <span>TAKE A CHILL PILL</span>
                <span className="w-2 h-2 rounded-full bg-[#143B14]/40 animate-ping ml-1" />
              </button>
            </div>

            {/* 14-Day Countdown Display */}
            <div className="bg-[#FAF8FE] border border-[#E9E3F8] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6E48AA]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F68B1E]" />
                  Official Launch in 14 Days
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  Harmattan Runway 2026
                </span>
              </div>

              {/* Countdown Ticker Boxes */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center font-mono">
                <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#DFD5F5] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-[#1C1A24] block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-sans font-semibold">
                    Days
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#DFD5F5] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-[#1C1A24] block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-sans font-semibold">
                    Hours
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#DFD5F5] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-[#1C1A24] block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-sans font-semibold">
                    Mins
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#DFD5F5] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-[#8B44FF] block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-sans font-semibold">
                    Secs
                  </span>
                </div>
              </div>
            </div>

            {/* VIP Priority Reservation Form for Edo, Ekpoma, Warri, Benin */}
            <div id="vip-form" className="pt-2 space-y-3">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email for Edo, Ekpoma, Warri & Benin drop"
                        className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 bg-[#1C1A24] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <span>Join VIP List</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-green-600" />
                      Priority express delivery across Edo, Ekpoma, Warri & Benin
                    </span>
                    <button
                      type="button"
                      onClick={onEnterStore}
                      className="text-[#8B44FF] font-bold hover:underline"
                    >
                      Direct Preview Entry →
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold">You are on the Priority Runway Register!</p>
                    <p className="text-green-800">
                      We have reserved your invitation for priority delivery in Edo (Benin City, Ekpoma) & Delta (Warri). Use code <b className="font-mono bg-white px-1.5 py-0.5 rounded border border-green-300">EDNA14DAYS</b> for 15% off launch orders.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Founder & Creative Director Portrait Showcase (Prominent Display) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md group">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#9C8BD9] via-[#F68B1E]/40 to-[#97E575]/40 rounded-3xl blur-md opacity-60 group-hover:opacity-100 transition duration-500" />

              {/* Founder Image Showcase Container */}
              <div
                onClick={() => setShowFounderModal(true)}
                className="relative rounded-2xl overflow-hidden shadow-[0_20px_45px_rgba(40,25,75,0.25)] border-2 border-white bg-[#1A1822] cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-[430px] sm:h-[480px] w-full overflow-hidden bg-stone-900">
                  <img
                    src={FOUNDER_PHOTO_PATH}
                    alt="Edna, Founder and Creative Director of Edna's Fashion Flair holding brand lookbook"
                    style={{ objectPosition: 'center 56%' }}
                    className="w-full h-full object-cover block select-none transform transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Gradient overlays for typographic contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Owner / Founder Verified Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black text-[#1C1A24] shadow-md flex items-center gap-1.5 border border-amber-200">
                    <Crown className="w-3.5 h-3.5 text-[#F68B1E] fill-[#F68B1E]" />
                    <span>Founder & Creative Director</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5 animate-pulse" />
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white/90 p-2 rounded-full hover:bg-black/90 transition-colors shadow">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  {/* Bottom Founder Identity Card */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white space-y-1 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#97E575] bg-[#143B14]/80 px-2.5 py-0.5 rounded-full border border-[#97E575]/50">
                        Brand Owner
                      </span>
                      <span className="text-[11px] text-white/90 font-medium">
                        Edo & Delta Fashion Atelier
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white flex items-center gap-2">
                      <span>EDNA</span>
                      <span className="text-xs sm:text-sm font-sans font-bold text-gray-200">
                        — Edna&apos;s Fashion Flair
                      </span>
                    </h2>

                    <p className="text-xs font-semibold text-amber-200 italic tracking-wide">
                      &ldquo;Where Luxury Meets Affordability&rdquo;
                    </p>

                    <p className="text-[11px] text-gray-200 line-clamp-1 pt-0.5">
                      Curating luxury couture crafted for Benin City, Ekpoma, Warri & beyond.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Store Unlock VIP Banner */}
              <div className="mt-4 bg-[#FAF8FE] border border-[#E9E3F8] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-[#1C1A24] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#F68B1E]" />
                    VIP Preview Pass Available
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Want to explore the catalog & 3D atelier right now?
                  </p>
                </div>
                <button
                  onClick={onEnterStore}
                  className="px-4 py-2.5 bg-[#F68B1E] hover:bg-[#E57A0D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Unlock Store</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Capsule Sneak Peek */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  Sneak Peek Arrivals:
                </span>
                <div className="flex items-center gap-2">
                  {PRODUCTS.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={onEnterStore}
                      className="group flex items-center gap-1.5 text-[11px] bg-white border border-gray-200 hover:border-black px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      title={p.name}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-4 h-4 rounded object-cover"
                      />
                      <span className="max-w-[75px] truncate font-medium text-gray-800">
                        {p.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Full Portrait Modal */}
      {showFounderModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowFounderModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFounderModal(false)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[58vh] bg-stone-900 flex items-center justify-center p-2">
              <img
                src={FOUNDER_PHOTO_PATH}
                alt="Edna, Founder of Edna's Fashion Flair"
                className="max-h-[54vh] w-auto object-contain block mx-auto rounded-lg shadow"
              />
            </div>

            <div className="p-5 sm:p-6 bg-white space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#6E48AA]">
                    Founder & Creative Director
                  </span>
                  <h3 className="text-xl font-serif font-black text-[#1C1A24]">
                    Edna — Edna&apos;s Fashion Flair
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                  <Crown className="w-3.5 h-3.5 text-[#F68B1E]" />
                  <span>Site Owner</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                &ldquo;Fashion that empowers, style that inspires.&rdquo; Edna leads our atelier in designing authentic luxury fashion for Edo (Benin City, Ekpoma) and Delta State (Warri) with nationwide courier delivery.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Launching officially in 14 days
                </span>
                <button
                  onClick={() => {
                    setShowFounderModal(false);
                    onEnterStore();
                  }}
                  className="px-4 py-2 bg-[#1C1A24] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Enter Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive "Chill Pill" Popover / Modal */}
      {showChillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-center relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowChillModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[#97E575]/25 mx-auto flex items-center justify-center text-[#1C5B1C]">
              <Pill className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-black text-[#1C5B1C] bg-[#97E575]/30 px-3 py-1 rounded-full">
                Chill Pill Prescribed #{chillPillsTaken}
              </span>
              <h3 className="text-2xl font-black text-[#1C1A24]">
                Take a Deep Breath & Relax!
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pour yourself an ice-cold glass of hibiscus Zobo or palm wine while our Edo (Benin City, Ekpoma) & Delta (Warri) tailors press the pleats for our Harmattan runway!
              </p>
            </div>

            {/* Special Promo Voucher */}
            <div className="bg-[#FAF8FE] border-2 border-dashed border-[#8B44FF]/40 rounded-2xl p-4 text-left space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#8B44FF]">
                Your Impatience Reward (15% Off)
              </p>
              <div className="flex items-center justify-between font-mono font-black text-lg text-[#1C1A24]">
                <span>CHILLPILL14</span>
                <span className="text-xs bg-[#8B44FF] text-white px-2 py-0.5 rounded font-sans font-semibold">
                  Valid for 14 Days
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Redeemable across all collections with fast doorstep delivery to Edo, Ekpoma, Warri, Benin & nationwide.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowChillModal(false);
                  onEnterStore();
                }}
                className="w-full py-3.5 bg-[#1C1A24] hover:bg-black text-white text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Can&apos;t Wait? Enter Live Store Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowChillModal(false)}
                className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                Continue Waiting Patiently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
