import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, Clock, Trophy, ShieldAlert, ArrowUpRight, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

export default function GamifiedHub({ pinnedProduct, onBuyNow, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('cobuy'); // cobuy or auction
  
  // ==========================================
  // CO-BUY STATE & SIMULATION
  // ==========================================
  const [coBuyCount, setCoBuyCount] = useState(11);
  const coBuyTarget = 15;
  const [hasJoinedCoBuy, setHasJoinedCoBuy] = useState(false);
  const [coBuyUnlocked, setCoBuyUnlocked] = useState(false);
  const [coBuyToasts, setCoBuyToasts] = useState([]);
  
  // Mock users list for simulation
  const mockUsers = ['rahul_t', 'sneha_gp', 'priya_dev', 'arjun_v', 'neha_patel', 'aman_raj', 'rohan_s', 'tanvi_m'];

  // Co-buy simulation effect
  useEffect(() => {
    if (coBuyUnlocked) return;

    // Periodically add simulated buyers
    const interval = setInterval(() => {
      setCoBuyCount(prev => {
        if (prev >= coBuyTarget) {
          clearInterval(interval);
          setCoBuyUnlocked(true);
          return coBuyTarget;
        }
        
        // Randomly decide if someone joins
        if (Math.random() > 0.4 && prev < coBuyTarget) {
          const newUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
          const newCount = prev + 1;
          
          // Trigger a floating toast notification
          addCoBuyToast(`${newUser} joined the Co-Buy!`);
          
          if (newCount >= coBuyTarget) {
            setCoBuyUnlocked(true);
            clearInterval(interval);
          }
          return newCount;
        }
        return prev;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [coBuyUnlocked]);

  const addCoBuyToast = (msg) => {
    const id = Date.now();
    setCoBuyToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setCoBuyToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleJoinCoBuy = () => {
    if (hasJoinedCoBuy || coBuyUnlocked) return;
    setHasJoinedCoBuy(true);
    addCoBuyToast("You joined the Co-Buy team!");
    setCoBuyCount(prev => {
      const newCount = prev + 1;
      if (newCount >= coBuyTarget) {
        setCoBuyUnlocked(true);
      }
      return newCount;
    });
  };

  // ==========================================
  // FLASH AUCTION STATE & SIMULATION
  // ==========================================
  const auctionProduct = {
    id: 'auction-exclusive',
    name: 'SwiftGlide Carbon Edition (LTD)',
    brand: 'Velo',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    originalPrice: 7999,
    category: 'Footwear'
  };

  const [auctionActive, setAuctionActive] = useState(true);
  const [currentBid, setCurrentBid] = useState(3800);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bidHistory, setBidHistory] = useState([
    { id: 1, user: 'aman_raj', amount: 3500, time: '20s ago' },
    { id: 2, user: 'sneha_gp', amount: 3800, time: '10s ago' }
  ]);
  const [userBidAmount, setUserBidAmount] = useState(0);
  const [auctionWon, setAuctionWon] = useState(false);
  const rivalTimerRef = useRef(null);

  // Auction timer countdown
  useEffect(() => {
    if (!auctionActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAuctionActive(false);
          // Check if user is the highest bidder
          if (bidHistory.length > 0 && bidHistory[0].user === 'You (Vijay)') {
            setAuctionWon(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionActive, bidHistory]);

  // Simulated rival bidder responses
  useEffect(() => {
    if (!auctionActive) return;

    // Check periodically for rival bids if user is currently winning
    const interval = setInterval(() => {
      if (bidHistory.length > 0 && bidHistory[0].user === 'You (Vijay)' && Math.random() > 0.4) {
        const rivalUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const bidIncrease = Math.floor(Math.random() * 2 + 1) * 200; // ₹200 or ₹400
        const newBid = currentBid + bidIncrease;
        
        setCurrentBid(newBid);
        setBidHistory(prev => [
          { id: Date.now(), user: rivalUser, amount: newBid, time: 'Just now' },
          ...prev
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [auctionActive, bidHistory, currentBid]);

  const handlePlaceBid = () => {
    if (!auctionActive) return;
    const bidAmount = currentBid + 200;
    setCurrentBid(bidAmount);
    setUserBidAmount(bidAmount);
    setBidHistory(prev => [
      { id: Date.now(), user: 'You (Vijay)', amount: bidAmount, time: 'Just now' },
      ...prev
    ]);

    // Fast rival response simulation to trigger competition
    if (rivalTimerRef.current) clearTimeout(rivalTimerRef.current);
    rivalTimerRef.current = setTimeout(() => {
      if (Math.random() > 0.3) {
        const rivalUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const counterBid = bidAmount + 200;
        setCurrentBid(counterBid);
        setBidHistory(prev => [
          { id: Date.now(), user: rivalUser, amount: counterBid, time: 'Just now' },
          ...prev
        ]);
      }
    }, 1500);
  };

  const handleResetAuction = () => {
    if (rivalTimerRef.current) clearTimeout(rivalTimerRef.current);
    setAuctionActive(true);
    setCurrentBid(3800);
    setTimeLeft(30);
    setBidHistory([
      { id: 1, user: 'aman_raj', amount: 3500, time: '20s ago' },
      { id: 2, user: 'sneha_gp', amount: 3800, time: '10s ago' }
    ]);
    setAuctionWon(false);
    setUserBidAmount(0);
  };

  // Co-buy target details
  const targetProduct = pinnedProduct || {
    id: 'cobuy-default',
    name: 'SwiftGlide Carbon Running Shoes',
    brand: 'Velo',
    price: 4999,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    category: 'Footwear'
  };

  const coBuyDiscountPrice = Math.round(targetProduct.price * 0.75); // 25% Off

  return (
    <div style={styles.hubContainer} className="glass-heavy">
      {/* Toast Overlay */}
      <div style={styles.toastContainer}>
        {coBuyToasts.map(t => (
          <div key={t.id} style={styles.toast} className="glass">
            <Zap size={12} color="var(--color-cyan)" style={{ marginRight: '6px' }} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Tab Switcher Headers */}
      <div style={styles.tabsHeader}>
        <button 
          onClick={() => setActiveTab('cobuy')}
          style={{
            ...styles.tabBtn,
            color: activeTab === 'cobuy' ? 'white' : 'var(--text-secondary)',
            borderBottom: activeTab === 'cobuy' ? '2px solid var(--color-pink)' : '2px solid transparent',
            background: activeTab === 'cobuy' ? 'rgba(236,72,153,0.05)' : 'transparent'
          }}
        >
          <Users size={14} style={{ marginRight: '6px' }} />
          Co-Buy Teams {coBuyUnlocked ? '🎉' : `(${coBuyCount}/${coBuyTarget})`}
        </button>
        <button 
          onClick={() => setActiveTab('auction')}
          style={{
            ...styles.tabBtn,
            color: activeTab === 'auction' ? 'white' : 'var(--text-secondary)',
            borderBottom: activeTab === 'auction' ? '2px solid var(--color-cyan)' : '2px solid transparent',
            background: activeTab === 'auction' ? 'rgba(6,182,212,0.05)' : 'transparent'
          }}
        >
          <Trophy size={14} style={{ marginRight: '6px' }} />
          Flash Auction {auctionActive ? `⏳ ${timeLeft}s` : ''}
        </button>
      </div>

      {/* TAB CONTENT: CO-BUY */}
      {activeTab === 'cobuy' && (
        <div style={styles.contentBody}>
          <div style={styles.productBlock}>
            <img src={targetProduct.image} alt={targetProduct.name} style={styles.prodThumb} />
            <div style={{ flex: 1 }}>
              <div style={styles.brandTag}>{targetProduct.brand} • Co-Buy Target</div>
              <h4 style={styles.prodTitle}>{targetProduct.name}</h4>
              <div style={styles.priceContainer}>
                <span style={styles.normalPrice}>₹{targetProduct.price.toLocaleString()}</span>
                <span style={styles.arrowIcon}>➔</span>
                <span style={styles.unlockedPrice}>₹{coBuyDiscountPrice.toLocaleString()}</span>
                <span style={styles.pctBadge}>⚡ 25% TEAM OFF</span>
              </div>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div style={styles.progressContainer}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>
                {coBuyUnlocked ? (
                  <span style={{ color: 'var(--color-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Team Goal Reached! Discount Unlocked
                  </span>
                ) : (
                  <span>🔥 Group buy active: <strong>{coBuyCount}</strong> of <strong>{coBuyTarget}</strong> buyers joined</span>
                )}
              </span>
              <span style={styles.progressPct}>
                {Math.round((coBuyCount / coBuyTarget) * 100)}%
              </span>
            </div>
            
            <div style={styles.progressBarBg}>
              <div 
                style={{
                  ...styles.progressBarFill,
                  width: `${(coBuyCount / coBuyTarget) * 100}%`,
                  background: coBuyUnlocked 
                    ? 'linear-gradient(90deg, var(--color-emerald), #34d399)'
                    : 'linear-gradient(90deg, var(--color-pink), #f472b6)'
                }}
              />
            </div>
          </div>

          {/* Action Row */}
          {!coBuyUnlocked ? (
            <button
              onClick={handleJoinCoBuy}
              disabled={hasJoinedCoBuy}
              style={{
                ...styles.actionBtn,
                background: hasJoinedCoBuy 
                  ? 'var(--bg-tertiary)' 
                  : 'linear-gradient(135deg, var(--color-pink), #db2777)',
                cursor: hasJoinedCoBuy ? 'default' : 'pointer'
              }}
            >
              {hasJoinedCoBuy ? '✅ Queued in Team (Waiting for others...)' : '🚀 Join Co-Buy & Claim 25% Off'}
            </button>
          ) : (
            <div style={styles.unlockedActionContainer}>
              <div style={styles.couponBanner} className="glass">
                <span>Code Unlocked: <strong>TEAMCOBUY25</strong></span>
              </div>
              <button
                onClick={() => onBuyNow({
                  ...targetProduct,
                  price: coBuyDiscountPrice,
                  name: `${targetProduct.name} (Co-Buy Team Discount)`
                })}
                style={{
                  ...styles.actionBtn,
                  background: 'linear-gradient(135deg, var(--color-emerald), #059669)'
                }}
              >
                🛒 Buy Instantly for ₹{coBuyDiscountPrice.toLocaleString()}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: FLASH AUCTION */}
      {activeTab === 'auction' && (
        <div style={styles.contentBody}>
          <div style={styles.productBlock}>
            <img src={auctionProduct.image} alt={auctionProduct.name} style={styles.prodThumb} />
            <div style={{ flex: 1 }}>
              <div style={styles.brandTag}>🔥 LIMITED EDITION AUCTION</div>
              <h4 style={styles.prodTitle}>{auctionProduct.name}</h4>
              <div style={styles.priceContainer}>
                <span style={styles.labelMuted}>Retail: ₹{auctionProduct.originalPrice.toLocaleString()}</span>
                <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>|</span>
                <span style={styles.labelLive}>Current Bid: <strong>₹{currentBid.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Bidding Interface */}
          {auctionActive ? (
            <div style={styles.auctionActiveDeck}>
              <div style={styles.timerBar}>
                <Clock size={12} color="var(--color-cyan)" style={{ marginRight: '6px' }} />
                <span>Time Remaining: <strong style={{ color: timeLeft < 10 ? 'var(--color-coral)' : 'var(--color-cyan)', fontSize: '13px' }}>{timeLeft}s</strong></span>
                {timeLeft < 10 && <span style={styles.pulseDot} />}
              </div>

              <div style={styles.bidRow}>
                <button
                  onClick={handlePlaceBid}
                  style={styles.bidButton}
                >
                  ⚡ Place Bid (₹{(currentBid + 200).toLocaleString()})
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.auctionEndedDeck}>
              {auctionWon ? (
                <div style={styles.wonBox} className="glass">
                  <Trophy size={28} color="var(--color-amber)" style={{ marginBottom: '8px' }} />
                  <h4 style={{ color: 'var(--color-amber)', fontWeight: 800 }}>🏆 YOU WON THE AUCTION!</h4>
                  <p style={{ fontSize: '11px', margin: '4px 0 12px', color: 'var(--text-primary)' }}>
                    Your winning bid: <strong>₹{currentBid.toLocaleString()}</strong> (Retail ₹7,999)
                  </p>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button
                      onClick={handleResetAuction}
                      style={styles.resetBtnSecondary}
                    >
                      <RefreshCw size={12} /> Play Again
                    </button>
                    <button
                      onClick={() => onBuyNow({
                        ...auctionProduct,
                        price: currentBid,
                        name: `${auctionProduct.name} (Auction Winner)`
                      })}
                      style={styles.checkoutBtnGold}
                    >
                      🛒 Claim & Checkout
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.lostBox} className="glass">
                  <ShieldAlert size={28} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                  <h4 style={{ color: 'var(--text-secondary)' }}>Auction Ended</h4>
                  <p style={{ fontSize: '11px', margin: '4px 0 12px', color: 'var(--text-muted)' }}>
                    Winning bid: <strong>₹{currentBid.toLocaleString()}</strong> by {bidHistory[0]?.user || 'rival'}
                  </p>
                  <button
                    onClick={handleResetAuction}
                    style={styles.actionBtn}
                  >
                    <RefreshCw size={12} style={{ marginRight: '6px' }} /> Retry Auction Bidding
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bid History Feed */}
          <div style={styles.historyBox}>
            <div style={styles.historyTitle}>Live Bid Logs</div>
            <div style={styles.historyList}>
              {bidHistory.map((bh, i) => (
                <div 
                  key={bh.id} 
                  style={{
                    ...styles.historyRow,
                    borderLeft: bh.user === 'You (Vijay)' ? '3px solid var(--color-cyan)' : '3px solid transparent',
                    backgroundColor: bh.user === 'You (Vijay)' ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                    animation: i === 0 ? 'bidScaleIn 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <span style={{ fontWeight: bh.user === 'You (Vijay)' ? '700' : '500', color: bh.user === 'You (Vijay)' ? 'white' : 'var(--text-secondary)' }}>
                    {bh.user}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={styles.bidAmountText}>₹{bh.amount.toLocaleString()}</span>
                    <span style={styles.bidTimeText}>{bh.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  hubContainer: {
    padding: '12px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative',
    overflow: 'hidden'
  },
  toastContainer: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    zIndex: 99
  },
  toast: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '9px',
    fontWeight: '700',
    color: 'white',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    alignItems: 'center',
    animation: 'toastFadeIn 0.3s ease-out forwards',
    border: '1px solid var(--color-cyan)'
  },
  tabsHeader: {
    display: 'flex',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '10px'
  },
  tabBtn: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    borderRadius: '6px 6px 0 0'
  },
  contentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  productBlock: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  prodThumb: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: '1px solid var(--border-color)'
  },
  brandTag: {
    fontSize: '8px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  prodTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    margin: '2px 0 4px',
    lineHeight: '1.2'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px'
  },
  normalPrice: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textDecoration: 'line-through'
  },
  arrowIcon: {
    fontSize: '9px',
    color: 'var(--text-muted)'
  },
  unlockedPrice: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'white'
  },
  pctBadge: {
    fontSize: '8px',
    fontWeight: '800',
    backgroundColor: 'rgba(236,72,153,0.15)',
    color: 'var(--color-pink)',
    padding: '2px 4px',
    borderRadius: '3px',
    border: '1px solid rgba(236,72,153,0.25)'
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '2px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px'
  },
  progressLabel: {
    color: 'var(--text-secondary)'
  },
  progressPct: {
    fontWeight: '700',
    color: 'white'
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  actionBtn: {
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'transform 0.2s ease, opacity 0.2s ease'
  },
  unlockedActionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  couponBanner: {
    padding: '6px',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '10px',
    color: 'var(--color-emerald)',
    border: '1px dashed rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)'
  },
  auctionActiveDeck: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  timerBar: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(255,255,255,0.01)',
    padding: '4px 8px',
    borderRadius: '6px',
    position: 'relative'
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--color-coral)',
    borderRadius: '50%',
    marginLeft: 'auto',
    animation: 'pulseFlash 1s infinite alternate'
  },
  bidRow: {
    display: 'flex',
    gap: '6px'
  },
  bidButton: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid rgba(6,182,212,0.3)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, var(--color-cyan), #0891b2)',
    transition: 'all 0.2s ease'
  },
  auctionEndedDeck: {
    textAlign: 'center'
  },
  wonBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.03)'
  },
  lostBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  resetBtnSecondary: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-secondary)',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  checkoutBtnGold: {
    flex: 2,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, var(--color-amber), #d97706)',
    cursor: 'pointer'
  },
  labelMuted: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textDecoration: 'line-through'
  },
  labelLive: {
    fontSize: '11px',
    color: 'var(--color-cyan)'
  },
  historyBox: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: '8px',
    padding: '8px',
    border: '1px solid var(--border-color)'
  },
  historyTitle: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxHeight: '75px',
    overflowY: 'auto'
  },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
    padding: '4px 6px',
    borderRadius: '4px'
  },
  bidAmountText: {
    fontWeight: '700',
    color: 'white'
  },
  bidTimeText: {
    fontSize: '8px',
    color: 'var(--text-muted)'
  }
};
