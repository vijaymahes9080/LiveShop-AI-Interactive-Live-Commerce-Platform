import React, { useState } from 'react';
import { Shield, Users, ShoppingBag, Eye, ShieldAlert, Check, X, RefreshCw } from 'lucide-react';
import { mockProducts } from '../../data/mockCatalog';

const MOCK_SECURITY_LOGS = [
  { id: 1, type: "Card Fraud Check", desc: "User @Rohan_K card gateway mismatch. Blocked retry limit.", severity: "high", time: "2 mins ago" },
  { id: 2, type: "Chat Moderation", desc: "Blocked profanity text from viewer @David_B.", severity: "low", time: "5 mins ago" },
  { id: 3, type: "Rate Limit Trigger", desc: "API endpoint /chat spam detected from IP 192.168.1.42.", severity: "medium", time: "12 mins ago" },
  { id: 4, type: "UPI Spoofing", desc: "Fake verification request payload matched blacklist pattern.", severity: "high", time: "22 mins ago" }
];

const MOCK_SELLER_REQUESTS = [
  { id: 101, name: "FashionHub Ltd", email: "verify@fashionhub.com", docs: "IncorporationCert.pdf", category: "Apparel" },
  { id: 102, name: "TechZone Retail", email: "admin@techzone.in", docs: "GstRegistration.jpg", category: "Electronics" }
];

export default function AdminModerator() {
  const [logs, setLogs] = useState(MOCK_SECURITY_LOGS);
  const [sellers, setSellers] = useState(MOCK_SELLER_REQUESTS);
  const [moderatedProducts, setModeratedProducts] = useState(mockProducts.slice(0, 5));

  const handleApproveSeller = (id) => {
    setSellers(prev => prev.filter(s => s.id !== id));
    alert("Seller approved and onboarding credentials dispatched!");
  };

  const handleRejectSeller = (id) => {
    setSellers(prev => prev.filter(s => s.id !== id));
    alert("Seller request rejected.");
  };

  const toggleProductStatus = (id) => {
    setModeratedProducts(prev => 
      prev.map(p => p.id === id ? { ...p, availability: !p.availability } : p)
    );
  };

  const clearLog = (id) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.adminTitle}>Admin Security & Moderation Hub</h2>

      {/* Admin stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard} className="glass">
          <Users size={20} color="var(--color-cyan)" />
          <div>
            <span style={styles.statLabel}>Active Platform Users</span>
            <h3 style={styles.statVal}>84,290</h3>
          </div>
        </div>

        <div style={styles.statCard} className="glass">
          <ShoppingBag size={20} color="var(--color-pink)" />
          <div>
            <span style={styles.statLabel}>Registered Sellers</span>
            <h3 style={styles.statVal}>1,142</h3>
          </div>
        </div>

        <div style={styles.statCard} className="glass">
          <ShieldAlert size={20} color="var(--color-amber)" />
          <div>
            <span style={styles.statLabel}>Active Security Audits</span>
            <h3 style={styles.statVal}>{logs.length} Warnings</h3>
          </div>
        </div>
      </div>

      <div style={styles.panelGrid}>
        {/* Real-time AI Security Monitoring */}
        <div style={styles.panel} className="glass">
          <div style={styles.panelHeader}>
            <Shield size={16} color="var(--color-coral)" />
            <h3 style={styles.panelTitle}>AI Fraud & Security Logs</h3>
          </div>

          <div style={styles.logList}>
            {logs.length === 0 ? (
              <p style={styles.emptyText}>All systems secure. No warnings logged.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={styles.logCard}>
                  <div style={styles.logMeta}>
                    <span 
                      style={{
                        ...styles.severityBadge,
                        backgroundColor: log.severity === 'high' ? 'rgba(244,63,94,0.15)' : log.severity === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                        color: log.severity === 'high' ? 'var(--color-coral)' : log.severity === 'medium' ? 'var(--color-amber)' : 'var(--text-secondary)'
                      }}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                    <span style={styles.logTime}>{log.time}</span>
                  </div>
                  <h4 style={styles.logType}>{log.type}</h4>
                  <p style={styles.logDesc}>{log.desc}</p>
                  <button onClick={() => clearLog(log.id)} style={styles.clearBtn}>Acknowledge</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Merchant onboarding requests */}
        <div style={styles.panel} className="glass">
          <div style={styles.panelHeader}>
            <Users size={16} color="var(--color-cyan)" />
            <h3 style={styles.panelTitle}>Seller Approvals</h3>
          </div>

          <div style={styles.listContainer}>
            {sellers.length === 0 ? (
              <p style={styles.emptyText}>No pending merchant verification requests.</p>
            ) : (
              sellers.map((s) => (
                <div key={s.id} style={styles.sellerRow}>
                  <div style={styles.sellerInfo}>
                    <h4 style={styles.sellerName}>{s.name}</h4>
                    <span style={styles.sellerDoc}>📁 Doc: {s.docs} ({s.category})</span>
                  </div>
                  <div style={styles.btnCol}>
                    <button onClick={() => handleApproveSeller(s.id)} style={styles.approveBtn}>
                      <Check size={12} />
                    </button>
                    <button onClick={() => handleRejectSeller(s.id)} style={styles.rejectBtn}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Product moderation */}
          <div style={styles.productModerationSection}>
            <div style={styles.panelHeader}>
              <ShoppingBag size={16} color="var(--color-pink)" />
              <h3 style={styles.panelTitle}>Product Moderation</h3>
            </div>
            
            <div style={styles.prodModList}>
              {moderatedProducts.map((p) => (
                <div key={p.id} style={styles.prodModItem}>
                  <img src={p.image} alt={p.name} style={styles.prodModImg} />
                  <div style={styles.prodModMeta}>
                    <span style={styles.prodModName}>{p.name}</span>
                    <span style={styles.prodModCategory}>ID: {p.id} | Rating: {p.rating} ⭐</span>
                  </div>
                  <button 
                    onClick={() => toggleProductStatus(p.id)}
                    style={{
                      ...styles.statusToggle,
                      backgroundColor: p.availability ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: p.availability ? 'var(--color-emerald)' : 'var(--color-coral)'
                    }}
                  >
                    {p.availability ? "APPROVED" : "BLOCKED"}
                  </button>
                </div>
              ))}
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
  adminTitle: {
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
  panelGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  panel: {
    flex: 1,
    minWidth: '340px',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px'
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '14px',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '440px',
    overflowY: 'auto'
  },
  logCard: {
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  },
  logMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  severityBadge: {
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  logTime: {
    fontSize: '10px',
    color: 'var(--text-muted)'
  },
  logType: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white'
  },
  logDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    lineHeight: '1.4'
  },
  clearBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-cyan)',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    padding: 0,
    textDecoration: 'underline'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  sellerInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  sellerName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white'
  },
  sellerDoc: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  btnCol: {
    display: 'flex',
    gap: '6px'
  },
  approveBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    border: '1px solid var(--color-emerald)',
    color: 'var(--color-emerald)',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rejectBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    border: '1px solid var(--color-coral)',
    color: 'var(--color-coral)',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productModerationSection: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  prodModList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '220px',
    overflowY: 'auto'
  },
  prodModItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  prodModImg: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    objectFit: 'cover'
  },
  prodModMeta: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  prodModName: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'white'
  },
  prodModCategory: {
    fontSize: '9px',
    color: 'var(--text-muted)'
  },
  statusToggle: {
    border: 'none',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '800',
    padding: '4px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  emptyText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px 0'
  }
};
