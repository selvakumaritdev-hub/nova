import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  List,
  Star,
  ShoppingBag,
  Zap,
  Check,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { apiService } from '../../services/api';
import { categoriesData } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('q') || '';
  const urlSort = searchParams.get('sort') || 'recommended';
  const urlSale = searchParams.get('sale') === 'true';

  // Filters & Pagination State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState(urlSort);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(urlSale);
  const [primeOnly, setPrimeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [addedItemMap, setAddedItemMap] = useState({});

  const limit = 24;

  // Synchronize URL parameters
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
      setPage(1);
    }
    if (searchParams.get('q') !== null && searchParams.get('q') !== undefined) {
      setSearchQuery(searchParams.get('q'));
      setPage(1);
    }
    if (searchParams.get('sale') === 'true') {
      setOnSaleOnly(true);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch filtered & paginated products
  useEffect(() => {
    let isMounted = true;

    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const res = await apiService.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          sortBy: sortBy,
          maxPrice: maxPrice < 200000 ? maxPrice : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          inStockOnly: inStockOnly || undefined,
          onSaleOnly: onSaleOnly || undefined,
          primeOnly: primeOnly || undefined,
          page: page,
          limit: limit
        });

        if (isMounted) {
          if (res && res.products) {
            setProducts(res.products);
            setTotalProducts(res.total || res.products.length);
            setTotalPages(res.totalPages || Math.ceil((res.total || res.products.length) / limit));
          } else if (Array.isArray(res)) {
            setProducts(res);
            setTotalProducts(res.length);
            setTotalPages(Math.ceil(res.length / limit) || 1);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching catalog:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchFiltered();
    return () => { isMounted = false; };
  }, [selectedCategory, searchQuery, sortBy, maxPrice, minRating, inStockOnly, onSaleOnly, primeOnly, page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('recommended');
    setMaxPrice(200000);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setPrimeOnly(false);
    setPage(1);
    setSearchParams({});
  };

  const handleCategorySelect = (catSlug) => {
    setSelectedCategory(catSlug);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (catSlug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catSlug);
    }
    setSearchParams(newParams);
  };

  const handleListQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    maxPrice < 200000 ||
    minRating > 0 ||
    inStockOnly ||
    onSaleOnly ||
    primeOnly;

  // Generate numbered pagination items
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const filterSidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Filters Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="var(--amazon-amber)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t('shop_filter_title')}</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('shop_filter_clear_all')}
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="input-label" style={{ fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('shop_filter_category')}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
          <button
            onClick={() => handleCategorySelect('all')}
            style={{
              padding: '7px 10px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.84rem',
              fontWeight: selectedCategory === 'all' ? 800 : 500,
              background: selectedCategory === 'all' ? 'rgba(254, 189, 105, 0.15)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--amazon-amber)' : 'var(--text-secondary)',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>{t('shop_all_products')}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>504</span>
          </button>

          {categoriesData.map(cat => {
            const catName = language === 'ta' ? cat.name_ta : language === 'hi' ? cat.name_hi : cat.name;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 800 : 500,
                  background: isSelected ? 'rgba(254, 189, 105, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--amazon-amber)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>{catName}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>36</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prime & Deals Checkboxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
        <label className="input-label" style={{ fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Delivery & Offers
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={primeOnly}
            onChange={(e) => {
              setPrimeOnly(e.target.checked);
              setPage(1);
            }}
            style={{ width: '16px', height: '16px', accentColor: 'var(--amazon-amber)' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <span style={{ color: '#007185', fontWeight: 800 }}>prime</span>
            <span>Next-Day Delivery</span>
          </span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => {
              setOnSaleOnly(e.target.checked);
              setPage(1);
            }}
            style={{ width: '16px', height: '16px', accentColor: 'var(--amazon-deal-red)' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="badge-prime-deal" style={{ fontSize: '0.66rem', padding: '1px 5px' }}>Deal</span>
            <span>Today's Deals & Discounts</span>
          </span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setPage(1);
            }}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-emerald)' }}
          />
          <span>{t('shop_filter_in_stock')}</span>
        </label>
      </div>

      {/* Price Range Slider & Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="input-label" style={{ fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('shop_filter_price')}
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--amazon-amber)', fontFamily: 'var(--font-display)' }}>
            Up to ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="200000"
          step="2500"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setPage(1);
          }}
          style={{ width: '100%', accentColor: 'var(--amazon-amber)', cursor: 'pointer' }}
        />
        {/* Quick price chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { label: "All", max: 200000 },
            { label: "< ₹5k", max: 5000 },
            { label: "< ₹25k", max: 25000 },
            { label: "< ₹75k", max: 75000 },
            { label: "< ₹1.5L", max: 150000 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setMaxPrice(preset.max);
                setPage(1);
              }}
              style={{
                fontSize: '0.74rem',
                padding: '3px 8px',
                borderRadius: '4px',
                border: maxPrice === preset.max ? '1px solid var(--amazon-amber)' : '1px solid var(--border-subtle)',
                background: maxPrice === preset.max ? 'rgba(254, 189, 105, 0.15)' : 'transparent',
                color: maxPrice === preset.max ? 'var(--amazon-amber)' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Review Rating Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
        <label className="input-label" style={{ fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Customer Reviews
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { val: 0, label: "All Ratings" },
            { val: 4.5, label: "4.5★ & Above" },
            { val: 4.0, label: "4.0★ & Above" }
          ].map(r => (
            <button
              key={r.val}
              onClick={() => {
                setMinRating(r.val);
                setPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.84rem',
                background: minRating === r.val ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: minRating === r.val ? 'var(--accent-gold)' : 'var(--text-secondary)',
                fontWeight: minRating === r.val ? 800 : 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Star size={14} fill={minRating === r.val ? "#F59E0B" : "none"} color={minRating === r.val ? "#F59E0B" : "currentColor"} />
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const startResult = Math.min((page - 1) * limit + 1, totalProducts);
  const endResult = Math.min(page * limit, totalProducts);

  return (
    <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '4rem' }}>
      {/* Top Department Banner / Breadcrumb */}
      <div
        style={{
          padding: '1.5rem 2rem',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(35, 47, 62, 0.8) 0%, rgba(19, 25, 33, 0.95) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div>
          <span className="section-tag" style={{ color: 'var(--amazon-amber)', borderColor: 'rgba(254, 189, 105, 0.3)' }}>
            {selectedCategory === 'all' ? "Nova Mall Retail Catalogue" : selectedCategory.toUpperCase()}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '6px', color: '#F8FAFC' }}>
            {selectedCategory === 'all'
              ? (searchQuery ? `Search Results for "${searchQuery}"` : "Explore 500+ Luxury Products")
              : (categoriesData.find(c => c.slug === selectedCategory)?.name || selectedCategory.toUpperCase())
            }
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Showing {totalProducts > 0 ? `${startResult}–${endResult}` : 0} of {totalProducts} verified products
            {selectedCategory !== 'all' && ` across ${categoriesData.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
          </p>
        </div>

        {/* Search Input in Header */}
        <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter within catalogue..."
            className="input-field"
            style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)', background: 'var(--bg-input)' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }} className="shop-layout">
        {/* Desktop Filter Sidebar */}
        <aside
          className="glass-panel desktop-filter-sidebar"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            position: 'sticky',
            top: '80px',
            background: 'var(--bg-card)'
          }}
        >
          {filterSidebarContent}
        </aside>

        {/* Catalogue Main Panel */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls Bar: Sort + Mobile Filter Button + View Mode */}
          <div
            className="glass-panel"
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'var(--bg-card)'
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

            {/* Results count text */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Page {page} of {totalPages} ({totalProducts} items)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Sorting Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {t('shop_sort_by')}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="input-field"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    width: 'auto',
                    cursor: 'pointer',
                    background: 'var(--bg-input)'
                  }}
                >
                  <option value="recommended">{t('shop_sort_recommended')}</option>
                  <option value="price-asc">{t('shop_sort_price_low_high')}</option>
                  <option value="price-desc">{t('shop_sort_price_high_low')}</option>
                  <option value="rating">{t('shop_sort_rating')}</option>
                  <option value="popular">{t('shop_sort_popular')}</option>
                  <option value="newest">{t('shop_sort_newest')}</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-tertiary)', padding: '2px', borderRadius: 'var(--radius-xs)' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className="btn-icon btn-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: viewMode === 'grid' ? 'var(--amazon-navy-light)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--amazon-amber)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Grid View (4 to 6 Columns)"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="btn-icon btn-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: viewMode === 'list' ? 'var(--amazon-navy-light)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--amazon-amber)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="badge badge-new" style={{ padding: '3px 8px', fontSize: '0.74rem' }}>
                  Department: {categoriesData.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleCategorySelect('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="badge badge-gold" style={{ padding: '3px 8px', fontSize: '0.74rem' }}>
                  Search: "{searchQuery}"
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setSearchQuery(''); setPage(1); }} />
                </span>
              )}
              {primeOnly && (
                <span className="badge badge-prime-tag" style={{ padding: '3px 8px', fontSize: '0.74rem', background: 'rgba(0, 113, 133, 0.15)' }}>
                  Prime Delivery
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setPrimeOnly(false); setPage(1); }} />
                </span>
              )}
              {onSaleOnly && (
                <span className="badge-prime-deal" style={{ padding: '3px 8px', fontSize: '0.74rem' }}>
                  Deals Only
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setOnSaleOnly(false); setPage(1); }} />
                </span>
              )}
              {maxPrice < 200000 && (
                <span className="badge badge-sale" style={{ padding: '3px 8px', fontSize: '0.74rem' }}>
                  Under ₹{maxPrice.toLocaleString('en-IN')}
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setMaxPrice(200000); setPage(1); }} />
                </span>
              )}
              {minRating > 0 && (
                <span className="badge badge-gold" style={{ padding: '3px 8px', fontSize: '0.74rem' }}>
                  {minRating}★+
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setMinRating(0); setPage(1); }} />
                </span>
              )}
            </div>
          )}

          {/* Product Grid / List Content */}
          {loading ? (
            <div className="product-grid-dense">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title={t('shop_empty_title')}
              subtitle={t('shop_empty_sub')}
              actionText={t('shop_reset_filters')}
              onActionClick={handleResetFilters}
            />
          ) : viewMode === 'grid' ? (
            <div className="product-grid-dense">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Amazon-style List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {products.map(product => (
                <div
                  key={product.id}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: '170px 1fr auto',
                    gap: '20px',
                    alignItems: 'center',
                    background: 'var(--bg-card)'
                  }}
                >
                  <Link to={`/product/${product.id}`} style={{ width: '100%', height: '150px', position: 'relative', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {product.isBestSeller && (
                      <span className="badge-bestseller" style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        #1 Best Seller
                      </span>
                    )}
                  </Link>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--amazon-amber)', fontWeight: 800 }}>
                      {product.brand}
                    </span>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '1.08rem', fontWeight: 800, lineHeight: 1.3 }}>{product.title}</h3>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontWeight: 800 }}>{product.rating}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} verified reviews)</span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4, maxHeight: '2.8em', overflow: 'hidden', margin: 0 }}>
                      {product.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ color: '#007185', fontSize: '0.75rem', fontWeight: 800 }}>prime</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{product.deliveryTime || "Get it by Tomorrow"}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', minWidth: '150px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          M.R.P.: ₹{product.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleListQuickAdd(product)}
                      className="btn-amazon-quick"
                      style={{ width: '140px' }}
                    >
                      {addedItemMap[product.id] ? (
                        <>
                          <Check size={14} />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm" style={{ width: '140px', textAlign: 'center', justifyContent: 'center' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Numbered Amazon-Style Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '2.5rem',
                padding: '16px',
                flexWrap: 'wrap'
              }}
            >
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="btn btn-secondary btn-sm"
                style={{
                  borderRadius: '6px',
                  padding: '7px 14px',
                  opacity: page <= 1 ? 0.35 : 1,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 700
                }}
              >
                ‹ Previous
              </button>

              {getPageNumbers().map((p, idx) => (
                p === '...' ? (
                  <span key={`dots-${idx}`} style={{ padding: '0 6px', color: 'var(--text-muted)', fontWeight: 700 }}>...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{
                      minWidth: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      border: p === page ? '1px solid var(--amazon-orange)' : '1px solid var(--border-subtle)',
                      background: p === page ? 'var(--amazon-amber)' : 'var(--bg-card)',
                      color: p === page ? '#131921' : 'var(--text-primary)',
                      fontWeight: p === page ? 900 : 700,
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {p}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="btn btn-secondary btn-sm"
                style={{
                  borderRadius: '6px',
                  padding: '7px 14px',
                  opacity: page >= totalPages ? 0.35 : 1,
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 700
                }}
              >
                Next ›
              </button>
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
