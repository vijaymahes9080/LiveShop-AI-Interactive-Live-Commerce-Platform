import React, { useState } from 'react';
import { Video, DollarSign, Users, Award, Plus, Check, Settings, Play, Square } from 'lucide-react';
import { mockProducts } from '../../data/mockCatalog';

export default function SellerDashboard({ activeStream, onPinProduct, onCreatePoll }) {
  const [isStreaming, setIsStreaming] = useState(true);
  const [pinnedId, setPinnedId] = useState(activeStream.pinnedProductId);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  
  // Custom Analytics Stats
  const revenue = 48500;
  const conversions = "4.2%";
  const totalSalesCount = 138;

  const handlePin = (prodId) => {
    setPinnedId(prodId);
    onPinProduct(prodId);
  };

  const handleAddOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleOptionChange = (idx, val) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmitPoll = (e) => {
    e.preventDefault();
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) return;

    onCreatePoll({
      question: pollQuestion,
      options: pollOptions.map(text => ({ text, votes: 0 })),
      totalVotes: 0
    });

    setPollQuestion("");
    setPollOptions(["", ""]);
    alert("Live stream poll published successfully!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.dashboardTitle}>Seller Stream Console</h2>

      {/* Analytics Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard} className="glass">
          <div style={styles.statIconWrapper}><DollarSign size={18} color="var(--color-emerald)" /></div>
          <div>
            <span style={styles.statLabel}>Total Live Revenue</span>
            <h3 style={styles.statVal}>₹{revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div style={styles.statCard} className="glass">
          <div style={styles.statIconWrapper}><Users size={18} color="var(--color-cyan)" /></div>
          <div>
            <span style={styles.statLabel}>Unique Buyers</span>
            <h3 style={styles.statVal}>{totalSalesCount}</h3>
          </div>
        </div>

        <div style={styles.statCard} className="glass">
          <div style={styles.statIconWrapper}><Award size={18} color="var(--color-pink)" /></div>
          <div>
            <span style={styles.statLabel}>Conversion Ratio</span>
            <h3 style={styles.statVal}>{conversions}</h3>
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Stream Management Controls */}
        <div style={{ ...styles.panel, flex: 1.2 }} className="glass">
          <h3 style={styles.panelTitle}>Broadcast Management</h3>
          
          <div style={styles.broadcastRow}>
            <div 
              style={{
                ...styles.streamIndicator,
                backgroundColor: isStreaming ? 'var(--color-coral)' : 'var(--text-muted)'
              }} 
            />
            <div style={styles.streamInfo}>
              <div style={styles.streamStatus}>{isStreaming ? "STREAMING LIVE" : "BROADCAST DISCONNECTED"}</div>
              <div style={styles.streamTopic}>Current: {activeStream.title}</div>
            </div>
            <button 
              onClick={() => setIsStreaming(!isStreaming)}
              style={{
                ...styles.streamBtn,
                backgroundColor: isStreaming ? 'var(--color-coral)' : 'var(--color-emerald)'
              }}
            >
              {isStreaming ? (
                <>
                  <Square size={12} fill="white" /> End Stream
                </>
              ) : (
                <>
                  <Play size={12} fill="white" /> Go Live
                </>
              )}
            </button>
          </div>

          {/* Product Pinning Control */}
          <div style={styles.section}>
            <span style={styles.subTitle}>Select Product to Pin Live</span>
            <div style={styles.productList}>
              {mockProducts.slice(0, 8).map((prod) => {
                const isPinned = pinnedId === prod.id;
                return (
                  <div 
                    key={prod.id} 
                    style={{
                      ...styles.productItem,
                      borderColor: isPinned ? 'var(--color-pink)' : 'var(--border-color)',
                      backgroundColor: isPinned ? 'rgba(236, 72, 153, 0.05)' : 'transparent'
                    }}
                  >
                    <img src={prod.image} alt={prod.name} style={styles.productImg} />
                    <div style={styles.productMeta}>
                      <span style={styles.productName}>{prod.name}</span>
                      <span style={styles.productPrice}>₹{prod.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => handlePin(prod.id)}
                      style={{
                        ...styles.pinBtn,
                        backgroundColor: isPinned ? 'var(--color-pink)' : 'rgba(255, 255, 255, 0.05)',
                        color: isPinned ? 'white' : 'var(--text-secondary)'
                      }}
                    >
                      {isPinned ? <Check size={12} /> : "Pin Live"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom SVG revenue graphs & Poll Creator */}
        <div style={{ ...styles.panel, flex: 1 }} className="glass">
          <h3 style={styles.panelTitle}>Interactive Poll Builder</h3>
          <form onSubmit={handleSubmitPoll} style={styles.pollForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Question / Topic</label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. Which product should we discount next?"
                required
                style={styles.formInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Options</label>
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  required
                  style={{ ...styles.formInput, marginBottom: '6px' }}
                />
              ))}
              {pollOptions.length < 4 && (
                <button 
                  type="button" 
                  onClick={handleAddOption} 
                  style={styles.addOptBtn}
                >
                  <Plus size={11} /> Add Option
                </button>
              )}
            </div>

            <button type="submit" className="custom-button" style={styles.submitPollBtn}>
              Publish Poll to Audience
            </button>
          </form>

          {/* Revenue Analytics Curve (Beautiful Custom Animated SVG) */}
          <div style={styles.chartSection}>
            <span style={styles.subTitle}>Hourly Sales Conversion Trend</span>
            <div style={styles.chartWrapper}>
              <svg viewBox="0 0 300 100" style={styles.svgChart}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-pink)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-pink)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.05)" />
                
                {/* Area path */}
                <path
                  d="M0,80 L30,60 L60,70 L90,40 L120,50 L150,30 L180,65 L210,45 L240,20 L270,35 L300,10 L300,100 L0,100 Z"
                  fill="url(#chartGradient)"
                />
                
                {/* Line path */}
                <path
                  d="M0,80 L30,60 L60,70 L90,40 L120,50 L150,30 L180,65 L210,45 L240,20 L270,35 L300,10"
                  fill="none"
                  stroke="var(--color-pink)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div style={styles.chartAxes}>
                <span>10 AM</span>
                <span>12 PM</span>
                <span>2 PM</span>
                <span>4 PM</span>
                <span>6 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  dashboardTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '22px',
    color: 'white'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  statCard: {
    padding: '18px 24px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid var(--border-color)'
  },
  statIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  statVal: {
    fontFamily: 'var(--font-title)',
    fontSize: '20px',
    fontWeight: '800',
    color: 'white',
    marginTop: '2px'
  },
  mainGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  panel: {
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '15px',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px'
  },
  broadcastRow: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid var(--border-color)'
  },
  streamIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    boxShadow: '0 0 8px currentColor'
  },
  streamInfo: {
    flex: 1
  },
  streamStatus: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'white'
  },
  streamTopic: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '240px'
  },
  streamBtn: {
    border: 'none',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  subTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '8px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column'
  },
  productList: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingRight: '6px'
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s ease'
  },
  productImg: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    objectFit: 'cover'
  },
  productMeta: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  productName: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '240px'
  },
  productPrice: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    marginTop: '2px'
  },
  pinBtn: {
    border: 'none',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '700',
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  pollForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)'
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    padding: '8px 12px',
    fontSize: '12px',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    width: '100%'
  },
  addOptBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-cyan)',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  submitPollBtn: {
    marginTop: '6px',
    padding: '10px 0',
    fontSize: '12px'
  },
  chartSection: {
    marginTop: '16px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px'
  },
  chartWrapper: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid var(--border-color)'
  },
  svgChart: {
    width: '100%',
    height: 'auto',
    overflow: 'visible'
  },
  chartAxes: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '9px',
    color: 'var(--text-muted)',
    marginTop: '6px',
    padding: '0 4px'
  }
};
