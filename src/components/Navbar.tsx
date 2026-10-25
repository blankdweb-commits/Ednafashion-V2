import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Sparkles, Heart, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenWaitingPage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWaitingPage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, openCart, wishlist } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navLinks = [
    { id: 'home', label: 'Lookbook' },
    { id: 'studio', label: '3D Atelier', badge: 'Interactive' },
    { id: 'shop', label: 'All Collections' },
    { id: 'wishlist', label: 'Wishlist', count: wishlistCount, isWishlist: true },
    { id: 'flash', label: 'Flash Offers', highlight: true },
    { id: 'track', label: 'Track Order' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EFE8D8]">
      {/* Top Notice Banner (Edo, Epoma, Warri, Benin & Nationwide Express Logistics) */}
      <div className="bg-[#231F18] text-[#FDFBF7] py-1.5 px-4 text-center text-xs tracking-wider flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F68B1E]" />
          <span>
            Authentic Nigerian Craftsmanship • Express Delivery Across <b>Edo (Benin City, Epoma)</b> & <b>Delta (Warri)</b>
          </span>
        </div>

        {/* Launch Standby Page Toggle */}
        {onOpenWaitingPage && (
          <button
            onClick={onOpenWaitingPage}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-[#97E575] hover:text-[#143B14] text-[#DFD3BC] transition-all ml-4 text-[11px] font-bold uppercase tracking-wider shadow-xs cursor-pointer"
            title="Return to Launch Standby Page (14 Days)"
          >
            <Clock className="w-3 h-3 text-[#F68B1E]" />
            <span>Launch Page (14 Days)</span>
          </button>
        )}
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#231F18] focus:outline-none"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo (Hingees Minimalist Presentation) */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-left cursor-pointer"
        >
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-[#231F18]">
            EDNAFASHION
          </span>
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#3D362A]/80 -mt-0.5">
            Delta State • Lagos Atelier
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-7 text-xs font-semibold uppercase tracking-widest text-[#231F18]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative py-1 transition-colors flex items-center gap-1.5 ${
                activeTab === link.id
                  ? 'text-[#A74520] font-bold border-b-2 border-[#A74520]'
                  : link.highlight
                  ? 'text-[#D92323] font-bold hover:underline'
                  : 'hover:text-[#A74520]'
              }`}
            >
              {link.id === 'studio' && <Sparkles className="w-3.5 h-3.5 text-[#F68B1E]" />}
              {link.isWishlist && (
                <Heart
                  className={`w-3.5 h-3.5 ${
                    wishlistCount > 0 ? 'text-[#D92323] fill-[#D92323]' : 'text-[#3D362A]'
                  }`}
                />
              )}
              <span>{link.label}</span>
              {link.count !== undefined && link.count > 0 && (
                <span className="bg-[#D92323] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {link.count}
                </span>
              )}
              {link.badge && (
                <span className="bg-[#A74520] text-white text-[9px] px-1.5 py-0.2 rounded-xs font-bold uppercase tracking-normal">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Wishlist Quick Button */}
          <button
            onClick={() => {
              setActiveTab('wishlist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2 text-[#231F18] hover:text-[#D92323] transition-colors relative"
            title="View Wishlist"
            aria-label="View Wishlist"
          >
            <Heart
              className={`w-5 h-5 ${
                wishlistCount > 0 ? 'text-[#D92323] fill-[#D92323]' : ''
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#D92323] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2 text-[#231F18] hover:text-[#A74520] transition-colors"
            title="Search Collections"
            aria-label="Search Collections"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Bag Icon with Jumia Counter */}
          <button
            onClick={openCart}
            className="p-2 text-[#231F18] hover:text-[#A74520] transition-colors relative"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#F68B1E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F7F3EB] border-b border-[#DFD3BC] px-6 py-4 space-y-3 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center justify-between w-full text-left py-2 text-xs font-bold uppercase tracking-widest ${
                activeTab === link.id
                  ? 'text-[#A74520]'
                  : link.highlight
                  ? 'text-[#D92323]'
                  : 'text-[#231F18]'
              }`}
            >
              <span>{link.label}</span>
              {link.count !== undefined && link.count > 0 && (
                <span className="bg-[#D92323] text-white text-[10px] px-2 py-0.5 rounded-full">
                  {link.count}
                </span>
              )}
            </button>
          ))}
          {onOpenWaitingPage && (
            <button
              onClick={() => {
                onOpenWaitingPage();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-bold text-[#F68B1E] uppercase tracking-widest"
            >
              Launch Waiting Room
            </button>
          )}
        </div>
      )}
    </header>
  );
};
