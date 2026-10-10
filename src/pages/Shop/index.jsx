import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Grid3X3,
  LayoutGrid,
  List,
  RotateCcw,
  Check,
  ChevronDown,
  Star
} from 'lucide-react';
import { apiService } from '../../services/api';
import { categoriesData } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();

  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('q') || '';
  const urlSort = searchParams.get('sort') || 'recommended';

  // Filters State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState(urlSort);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Synchronize URL parameters
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('q')) {
      setSearchQuery(searchParams.get('q'));
    }
  }, [searchParams]);

  // Fetch filtered products
  useEffect(() => {
    let isMounted = true;

    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          sortBy: sortBy,
          maxPrice: maxPrice < 200000 ? maxPrice : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          inStockOnly: inStockOnly,
          onSaleOnly: onSaleOnly,
          limit: 60
        });

        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching catalog:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchFiltered();
    return () => { isMounted = false; };
  }, [selectedCategory, searchQuery, sortBy, maxPrice, minRating, inStockOnly, onSaleOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('recommended');
    setMaxPrice(200000);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    maxPrice < 200000 ||
    minRating > 0 ||
    inStockOnly ||
    onSaleOnly;

  const filterSidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Filters Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('shop_filter_title')}</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 600 }}
          >
            {t('shop_filter_clear_all')}
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="input-label">{t('shop_filter_category')}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.85rem',
              fontWeight: selectedCategory === 'all' ? 700 : 500,
              background: selectedCategory === 'all' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>{t('shop_all_products')}</span>
          </button>

          {categoriesData.map(cat => {
            const catName = language === 'ta' ? cat.name_ta : language === 'hi' ? cat.name_hi : cat.name;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{catName}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="input-label">{t('shop_filter_price')}</label>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Up to ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="200000"
          step="2500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>₹1,000</span>
          <span>₹2,00,000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="input-label">{t('shop_filter_rating')}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { val: 0, label: "All Ratings" },
            { val: 4.5, label: "4.5★ & Above" },
            { val: 4.0, label: "4.0★ & Above" }
          ].map(r => (
            <button
              key={r.val}
              onClick={() => setMinRating(r.val)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.85rem',
                background: minRating === r.val ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: minRating === r.val ? 'var(--accent-gold)' : 'var(--text-secondary)',
                fontWeight: minRating === r.val ? 700 : 500
              }}
            >
              <Star size={14} fill={minRating === r.val ? "#F59E0B" : "none"} color={minRating === r.val ? "#F59E0B" : "currentColor"} />
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes: In-Stock & On Sale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
          />
          <span>{t('shop_filter_in_stock')}</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-rose)' }}
          />
          <span>{t('shop_filter_on_sale')}</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Banner Header */}
      <div
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 19, 28, 0.95) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div>
          <span className="section-tag">
            {selectedCategory === 'all' ? "Curated Marketplace" : selectedCategory.toUpperCase()}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
            {selectedCategory === 'all' ? t('shop_title') : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            {t('shop_showing_results')} {products.length} {t('shop_of')} {products.length} {t('shop_products')}
          </p>
        </div>

        {/* Search Input in Header */}
        <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within catalog..."
            className="input-field"
            style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }} className="shop-layout">
        {/* Desktop Filter Sidebar */}
        <aside
          className="glass-panel desktop-filter-sidebar"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            position: 'sticky',
            top: '100px'
          }}
        >
          {filterSidebarContent}
        </aside>

        {/* Catalog Main Panel */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls Bar: Sort + Mobile Filter Button + View Mode */}
          <div
            className="glass-panel"
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="btn btn-secondary btn-sm mobile-filter-btn"
              style={{ display: 'none' }}
            >
              <Filter size={15} />
              <span>Filters {hasActiveFilters && "(Active)"}</span>
            </button>

            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {t('shop_sort_by')}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: 'auto',
                  cursor: 'pointer'
                }}
              >
                <option value="recommended">{t('shop_sort_recommended')}</option>
                <option value="price-asc">{t('shop_sort_price_low_high')}</option>
                <option value="price-desc">{t('shop_sort_price_high_low')}</option>
                <option value="rating">{t('shop_sort_rating')}</option>
                <option value="newest">{t('shop_sort_newest')}</option>
                <option value="popular">{t('shop_sort_popular')}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-xs)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="btn-icon btn-sm"
                style={{
                  width: '32px',
                  height: '32px',
                  background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="btn-icon btn-sm"
                style={{
                  width: '32px',
                  height: '32px',
                  background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                  color: viewMode === 'list' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="badge badge-new" style={{ padding: '4px 10px' }}>
                  Category: {selectedCategory}
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="badge badge-gold" style={{ padding: '4px 10px' }}>
                  Search: "{searchQuery}"
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSearchQuery('')} />
                </span>
              )}
              {maxPrice < 200000 && (
                <span className="badge badge-sale" style={{ padding: '4px 10px' }}>
                  Under ₹{maxPrice.toLocaleString('en-IN')}
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setMaxPrice(200000)} />
                </span>
              )}
              {minRating > 0 && (
                <span className="badge badge-gold" style={{ padding: '4px 10px' }}>
                  {minRating}★+
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setMinRating(0)} />
                </span>
              )}
            </div>
          )}

          {/* Product Grid / List Content */}
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title={t('shop_empty_title')}
              subtitle={t('shop_empty_sub')}
              actionText={t('shop_reset_filters')}
              onActionClick={handleResetFilters}
            />
          ) : viewMode === 'grid' ? (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {products.map(product => (
                <div
                  key={product.id}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {product.brand}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{product.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, maxHeight: '2.8em', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontWeight: 700 }}>{product.rating}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5, 7, 12, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              justifyContent: 'flex-start'
            }}
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              style={{
                width: '85%',
                maxWidth: '340px',
                height: '100%',
                background: 'var(--bg-secondary)',
                padding: '24px',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="btn-icon">
                  <X size={18} />
                </button>
              </div>
              {filterSidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filter-sidebar {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
