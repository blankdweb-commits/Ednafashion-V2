import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string) => void;
  initialFilter?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onNavigate,
  initialFilter = 'All',
}) => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showDiscountOnly, setShowDiscountOnly] = useState<boolean>(false);

  const categories = ['All', 'Outerwear', 'Tailoring', 'Dresses', 'Trousers'];

  const filtered = products
    .filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (showDiscountOnly && p.sale_price_kobo === null) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesFabric = p.details.fabric.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesFabric && !matchesCategory) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.sale_price_kobo ?? a.base_price_kobo;
      const priceB = b.sale_price_kobo ?? b.base_price_kobo;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return 0; // featured default
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#EFE8D8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#A74520]">
            Ednafashion Studio Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#231F18] mt-1">
            {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
          </h1>
          <p className="text-xs text-[#3D362A]/70 mt-1">
            Showing {filtered.length} Nigerian handcrafted garments
          </p>
        </div>

        {/* 3D Atelier Quick Launcher Link */}
        <button
          onClick={() => onNavigate('studio')}
          className="bg-[#231F18] hover:bg-[#A74520] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors w-fit"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F68B1E]" />
          <span>Switch to 3D Atelier</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 border border-[#EFE8D8] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#3D362A]/50 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Adire, linen, raw silk, dresses..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#DFD3BC] bg-[#FDFBF7] text-[#231F18] focus:outline-none focus:border-[#231F18]"
          />
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs uppercase tracking-wider font-semibold px-3 py-1.5 transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#231F18] text-[#FDFBF7] border-[#231F18]'
                  : 'bg-white text-[#231F18] border-[#DFD3BC] hover:border-[#3D362A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Discount Toggle & Sort Selector */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#D92323] cursor-pointer">
            <input
              type="checkbox"
              checked={showDiscountOnly}
              onChange={(e) => setShowDiscountOnly(e.target.checked)}
              className="accent-[#D92323]"
            />
            <span>Flash Deals Only</span>
          </label>

          <div className="flex items-center gap-1 border-l border-[#DFD3BC] pl-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#3D362A]/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs uppercase tracking-wider bg-transparent text-[#231F18] focus:outline-none cursor-pointer py-1"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#EFE8D8] p-8">
          <p className="font-serif text-xl text-[#231F18]">No garments found matching this filter.</p>
          <p className="text-xs text-[#3D362A]/70 mt-1">Try resetting your search or category pills.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setShowDiscountOnly(false);
            }}
            className="mt-4 px-6 py-2 bg-[#231F18] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#A74520] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onLaunch3D={() => onNavigate('studio')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
