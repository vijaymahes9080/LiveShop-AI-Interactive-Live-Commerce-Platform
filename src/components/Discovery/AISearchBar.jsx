import React, { useState } from 'react';
import { Search, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { searchProductsAI } from '../../utils/aiEngine';

const EXAMPLE_QUERIES = [
  "Show black shoes under ₹3000",
  "Laptops for coding under 60000",
  "Suggest sustainable products",
  "Lip shade cosmetics",
  "Gym dumbbells and yoga mats"
];

export default function AISearchBar({ onSearchResults, onToggleFilters, activeFiltersCount }) {
  const [query, setQuery] = useState("");
  const [resultsMeta, setResultsMeta] = useState(null);

  const handleSearch = (searchQuery) => {
    const q = searchQuery || query;
    setQuery(q);
    
    const results = searchProductsAI(q);
    onSearchResults(results.products, results.similarItems || []);
    
    if (q.trim()) {
      setResultsMeta({
        confidence: results.confidence,
        intent: results.intent,
        categories: results.relatedCategories || []
      });
    } else {
      setResultsMeta(null);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResultsMeta(null);
    handleSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      {/* Search Input Row */}
      <div style={styles.searchRow}>
        <div style={styles.inputWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products naturally... (e.g. 'sustainable runners under ₹5000')"
            style={styles.input}
          />
          <button onClick={() => handleSearch()} style={styles.goBtn}>
            <Sparkles size={14} />
            AI Search
          </button>
        </div>

        <button onClick={onToggleFilters} style={styles.filterBtn} className="custom-button-secondary">
          <Filter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && <span style={styles.badge}>{activeFiltersCount}</span>}
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={styles.chipWrapper}>
        <span style={styles.chipLabel}>Try AI Prompt:</span>
        <div style={styles.chipScroll}>
          {EXAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleSearch(q);
              }}
              style={styles.chip}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* AI Intent & Confidence Score Block */}
      {resultsMeta && (
        <div style={styles.metaBlock} className="glass">
          <div style={styles.metaRow}>
            <span style={styles.sparkleLabel}>
              <Sparkles size={12} color="var(--color-pink)" />
              AI Intent Parser
            </span>
            <span style={styles.confidence}>
              Confidence Match: <strong>{Math.round(resultsMeta.confidence * 100)}%</strong>
            </span>
          </div>

          <div style={styles.intentTags}>
            {resultsMeta.intent.category && (
              <span style={styles.tag}>Category: <strong>{resultsMeta.intent.category}</strong></span>
            )}
            {resultsMeta.intent.color && (
              <span style={styles.tag}>Color: <strong>{resultsMeta.intent.color}</strong></span>
            )}
            {resultsMeta.intent.maxPrice && (
              <span style={styles.tag}>Budget Cap: <strong>₹{resultsMeta.intent.maxPrice}</strong></span>
            )}
            {resultsMeta.intent.sustainability && (
              <span style={{ ...styles.tag, borderColor: 'var(--color-emerald)', color: 'var(--color-emerald)' }}>
                🌿 Eco-Friendly
              </span>
            )}
            {resultsMeta.intent.trending && (
              <span style={{ ...styles.tag, borderColor: 'var(--color-pink)', color: 'var(--color-pink)' }}>
                🔥 Trending Check
              </span>
            )}
            {resultsMeta.categories.length > 0 && (
              <span style={styles.tag}>Indexes scanned: {resultsMeta.categories.join(", ")}</span>
            )}
            <button onClick={handleClear} style={styles.resetBtn}>
              <RefreshCw size={11} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    marginBottom: '20px'
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    width: '100%'
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)'
  },
  input: {
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'white',
    padding: '12px 120px 12px 42px',
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)'
  },
  goBtn: {
    position: 'absolute',
    right: '6px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  },
  filterBtn: {
    height: '46px',
    borderRadius: '12px',
    padding: '0 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  badge: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '800',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '4px'
  },
  chipWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    overflow: 'hidden'
  },
  chipLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  chipScroll: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    padding: '4px 0',
    width: '100%'
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    color: 'var(--text-secondary)',
    padding: '4px 12px',
    fontSize: '11px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  metaBlock: {
    padding: '12px 16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px dashed var(--border-glow)'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sparkleLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'uppercase'
  },
  confidence: {
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  intentTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'center'
  },
  tag: {
    fontSize: '10px',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '6px'
  },
  resetBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-coral)',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: 'auto'
  }
};
