import React, { useState } from 'react';
import { Star, Shield, Award, Sparkles } from 'lucide-react';

const CATEGORIES = ["Tech", "Fashion", "Footwear", "Beauty", "Home", "Sports"];
const RATINGS = [4.5, 4.0, 3.5];

export default function SmartFilter({ onApplyFilters, onResetFilters }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(80000);
  const [minRating, setMinRating] = useState(null);
  const [deliverySpeed, setDeliverySpeed] = useState("all");
  const [ecoFriendlyOnly, setEcoFriendlyOnly] = useState(false);
  const [trendingOnly, setTrendingOnly] = useState(false);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      maxPrice,
      minRating,
      deliverySpeed,
      ecoFriendly: ecoFriendlyOnly,
      trending: trendingOnly
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMaxPrice(80000);
    setMinRating(null);
    setDeliverySpeed("all");
    setEcoFriendlyOnly(false);
    setTrendingOnly(false);
    onResetFilters();
  };

  return (
    <div style={styles.container} className="glass">
      <h3 style={styles.title}>Filter Catalog</h3>
      
      {/* Category Section */}
      <div style={styles.section}>
        <span style={styles.label}>Product Category</span>
        <div style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  ...styles.chip,
                  backgroundColor: active ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  borderColor: active ? 'var(--color-accent)' : 'var(--border-color)',
                  color: active ? 'white' : 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div style={styles.section}>
        <div style={styles.labelRow}>
          <span style={styles.label}>Max Price</span>
          <span style={styles.value}>₹{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="500"
          max="80000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          style={styles.slider}
        />
        <div style={styles.sliderTicks}>
          <span>₹500</span>
          <span>₹40k</span>
          <span>₹80k</span>
        </div>
      </div>

      {/* Ratings Filter */}
      <div style={styles.section}>
        <span style={styles.label}>Minimum Rating</span>
        <div style={styles.ratingRow}>
          {RATINGS.map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? null : rating)}
              style={{
                ...styles.ratingBtn,
                backgroundColor: minRating === rating ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: minRating === rating ? 'var(--color-amber)' : 'var(--border-color)',
                color: minRating === rating ? 'white' : 'var(--text-secondary)'
              }}
            >
              {rating}+ <Star size={12} fill="currentColor" color="var(--color-amber)" />
            </button>
          ))}
        </div>
      </div>

      {/* Fast Delivery & Extras */}
      <div style={styles.section}>
        <span style={styles.label}>Delivery Speed</span>
        <div style={styles.grid}>
          <button
            onClick={() => setDeliverySpeed("all")}
            style={{
              ...styles.chip,
              backgroundColor: deliverySpeed === "all" ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: deliverySpeed === "all" ? 'var(--color-cyan)' : 'var(--border-color)'
            }}
          >
            All Speeds
          </button>
          <button
            onClick={() => setDeliverySpeed("1 Day")}
            style={{
              ...styles.chip,
              backgroundColor: deliverySpeed === "1 Day" ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: deliverySpeed === "1 Day" ? 'var(--color-cyan)' : 'var(--border-color)'
            }}
          >
            ⚡ Next-Day Delivery
          </button>
        </div>
      </div>

      {/* Eco & Trending toggles */}
      <div style={styles.toggleSection}>
        <label style={styles.toggleRow}>
          <input
            type="checkbox"
            checked={ecoFriendlyOnly}
            onChange={(e) => setEcoFriendlyOnly(e.target.checked)}
            style={styles.checkbox}
          />
          <div style={styles.toggleText}>
            <span style={styles.toggleTitle}>🌿 Eco-Friendly Choice</span>
            <span style={styles.toggleDesc}>Sustainability rating &gt; 90%</span>
          </div>
        </label>

        <label style={styles.toggleRow}>
          <input
            type="checkbox"
            checked={trendingOnly}
            onChange={(e) => setTrendingOnly(e.target.checked)}
            style={styles.checkbox}
          />
          <div style={styles.toggleText}>
            <span style={styles.toggleTitle}>🔥 Trending Highlights</span>
            <span style={styles.toggleDesc}>Most viewed and liked products</span>
          </div>
        </label>
      </div>

      {/* Filter Buttons */}
      <div style={styles.actionRow}>
        <button onClick={handleReset} style={styles.resetBtn}>Reset All</button>
        <button onClick={handleApply} style={styles.applyBtn} className="custom-button">Apply Filters</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    height: 'fit-content'
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'white',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  section: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  chip: {
    border: '1px solid transparent',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  value: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'white'
  },
  slider: {
    width: '100%',
    accentColor: 'var(--color-accent)',
    cursor: 'pointer',
    height: '4px',
    background: 'var(--border-color)',
    borderRadius: '2px'
  },
  sliderTicks: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-muted)'
  },
  ratingRow: {
    display: 'flex',
    gap: '8px'
  },
  ratingBtn: {
    flex: 1,
    border: '1px solid transparent',
    borderRadius: '8px',
    padding: '6px 0',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.2s ease'
  },
  toggleSection: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  toggleRow: {
    display: 'flex',
    gap: '10px',
    cursor: 'pointer',
    alignItems: 'flex-start'
  },
  checkbox: {
    marginTop: '3px',
    accentColor: 'var(--color-accent)'
  },
  toggleText: {
    display: 'flex',
    flexDirection: 'column'
  },
  toggleTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white'
  },
  toggleDesc: {
    fontSize: '10px',
    color: 'var(--text-secondary)'
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  resetBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  applyBtn: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '12px'
  }
};
