import React, { useState } from 'react';
import { ShoppingBag, Star, HelpCircle, X, ChevronUp, ShoppingCart } from 'lucide-react';

export default function ProductOverlay({ product, poll, onAddToCart, onBuyNow }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedVote, setSelectedVote] = useState(null);
  const [localPoll, setLocalPoll] = useState(poll);

  const handleVote = (idx) => {
    if (selectedVote !== null) return; // Can only vote once
    setSelectedVote(idx);
    
    // Update poll votes
    const updatedOptions = localPoll.options.map((opt, i) => {
      if (i === idx) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });
    
    setLocalPoll({
      ...localPoll,
      options: updatedOptions,
      totalVotes: localPoll.totalVotes + 1
    });
  };

  const calculatePercent = (votes) => {
    if (localPoll.totalVotes === 0) return 0;
    return Math.round((votes / localPoll.totalVotes) * 100);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={styles.minBtn} className="glass-heavy">
        <ShoppingBag size={18} color="var(--color-pink)" />
        <span style={styles.minBtnText}>View Pinned Deal</span>
      </button>
    );
  }

  return (
    <div style={styles.container}>
      {/* Pinned Product Card */}
      {product && (
        <div style={styles.card} className="glass-heavy">
          <div style={styles.cardHeader}>
            <div style={styles.pinnedLabel}>📌 PINNED BY SELLER</div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              <X size={14} />
            </button>
          </div>

          <div style={styles.content}>
            <img src={product.image} alt={product.name} style={styles.prodImage} />
            <div style={styles.details}>
              <h4 style={styles.prodName}>{product.name}</h4>
              <div style={styles.brandRow}>
                <span style={styles.brand}>{product.brand}</span>
                <span style={styles.rating}>
                  <Star size={12} fill="currentColor" color="var(--color-amber)" />
                  {product.rating}
                </span>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.price}>₹{product.price.toLocaleString()}</span>
                {product.discount > 0 && (
                  <>
                    <span style={styles.oldPrice}>
                      ₹{Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}
                    </span>
                    <span style={styles.discountBadge}>{product.discount}% OFF</span>
                  </>
                )}
              </div>
              <div style={styles.actionRow}>
                <button 
                  onClick={() => onAddToCart(product)} 
                  style={styles.cartBtn}
                  className="custom-button-secondary"
                >
                  <ShoppingCart size={14} />
                  Add
                </button>
                <button 
                  onClick={() => onBuyNow(product)} 
                  style={styles.buyBtn}
                  className="custom-button"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Poll Card */}
      {localPoll && (
        <div style={styles.pollCard} className="glass-heavy">
          <div style={styles.pollHeader}>
            <HelpCircle size={14} color="var(--color-cyan)" />
            <span style={styles.pollTitle}>LIVE STREAM POLL</span>
          </div>
          <p style={styles.pollQuestion}>{localPoll.question}</p>
          
          <div style={styles.pollOptions}>
            {localPoll.options.map((opt, idx) => {
              const pct = calculatePercent(opt.votes);
              return (
                <button
                  key={idx}
                  onClick={() => handleVote(idx)}
                  disabled={selectedVote !== null}
                  style={styles.optBtn}
                >
                  {/* Fill Progress Bar */}
                  <div 
                    style={{
                      ...styles.optProgress,
                      width: `${pct}%`,
                      backgroundColor: selectedVote === idx ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                  />
                  <div style={styles.optTextRow}>
                    <span style={{ fontWeight: selectedVote === idx ? '700' : '400' }}>
                      {opt.text}
                      {selectedVote === idx && " ✓"}
                    </span>
                    <span style={styles.optPct}>{pct}% ({opt.votes})</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={styles.pollFooter}>Total votes: {localPoll.totalVotes}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    left: '20px',
    bottom: '120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 20,
    maxWidth: '340px',
    width: 'calc(100% - 40px)'
  },
  minBtn: {
    position: 'absolute',
    left: '20px',
    bottom: '120px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    zIndex: 20,
    boxShadow: 'var(--shadow-lg)'
  },
  minBtnText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  card: {
    padding: '12px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  pinnedLabel: {
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    color: 'var(--color-pink)'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    gap: '12px'
  },
  prodImage: {
    width: '76px',
    height: '76px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid var(--border-color)'
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  prodName: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.3',
    marginBottom: '2px'
  },
  brandRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  brand: {
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '11px',
    color: 'var(--text-primary)',
    fontWeight: '600'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px'
  },
  price: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'white'
  },
  oldPrice: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textDecoration: 'line-through'
  },
  discountBadge: {
    fontSize: '9px',
    fontWeight: '800',
    backgroundColor: 'var(--color-emerald)',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '3px'
  },
  actionRow: {
    display: 'flex',
    gap: '6px'
  },
  cartBtn: {
    flex: 1,
    padding: '6px 8px',
    fontSize: '11px'
  },
  buyBtn: {
    flex: 1.5,
    padding: '6px 12px',
    fontSize: '11px',
    background: 'linear-gradient(135deg, var(--color-pink), #db2777)'
  },
  pollCard: {
    padding: '12px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)'
  },
  pollHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-cyan)',
    marginBottom: '6px'
  },
  pollTitle: {
    letterSpacing: '0.5px'
  },
  pollQuestion: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '10px',
    lineHeight: '1.4'
  },
  pollOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  optBtn: {
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '11px',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  optProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1,
    transition: 'width 0.4s ease-out'
  },
  optTextRow: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optPct: {
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  pollFooter: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '6px',
    textAlign: 'right'
  }
};
