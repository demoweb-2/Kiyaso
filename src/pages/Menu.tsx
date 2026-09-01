import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import { fetchCategories, fetchMenuItems } from '@/lib/data';
import type { Category, MenuItem } from '@/types';

type SortOption = 'popular' | 'price-low' | 'price-high' | 'name';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchMenuItems()])
      .then(([cats, menuItems]) => {
        setCategories(cats);
        setItems(menuItems);
      })
      .finally(() => setLoading(false));
  }, []);

  const setCategory = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const filteredItems = useMemo(() => {
    let result = items;

    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) result = result.filter((i) => i.category_id === cat.id);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description?.toLowerCase().includes(q) ?? false)
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => Number(b.is_popular) - Number(a.is_popular) || a.sort_order - b.sort_order);
    }

    return sorted;
  }, [items, activeCategory, categories, search, sortBy]);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-label mb-3 justify-center">Our Menu</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              EXPLORE THE <span className="text-brand-600">TASTE</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl mx-auto">
              Bold flavors, fresh ingredients, and dishes made to perfection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-charcoal-950/95 backdrop-blur-lg border-y border-white/5 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search + sort row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-2.5 bg-charcoal-900 border border-white/10 rounded-xl text-white placeholder:text-charcoal-500 text-sm focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 bg-charcoal-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-10 h-10 rounded-xl bg-charcoal-900 border border-white/10 flex items-center justify-center"
            >
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Category pills */}
          <div className={`flex gap-2 overflow-x-auto scrollbar-hide ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-charcoal-900 text-charcoal-300 border border-white/10 hover:border-white/20'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-brand-600 text-white'
                    : 'bg-charcoal-900 text-charcoal-300 border border-white/10 hover:border-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-charcoal-800 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-charcoal-400 text-lg mb-2">No dishes found</p>
              <button onClick={() => { setSearch(''); setCategory('all'); }} className="text-brand-500 font-semibold">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-charcoal-400 text-sm mb-6">{filteredItems.length} items</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item, i) => (
                  <FoodCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
