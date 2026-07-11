import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Eye, Video, ShieldAlert, ShoppingCart, Star, X, Info, Zap, AlertCircle } from 'lucide-react';
import { mockStreams, mockProducts } from './data/mockCatalog';

// Components
import StreamPlayer from './components/StreamRoom/StreamPlayer';
import LiveChat from './components/StreamRoom/LiveChat';
import ReactionBar from './components/StreamRoom/ReactionBar';
import ProductOverlay from './components/StreamRoom/ProductOverlay';
import AISearchBar from './components/Discovery/AISearchBar';
import SmartFilter from './components/Discovery/SmartFilter';
import VisualSearch from './components/Discovery/VisualSearch';
import AssistantModal from './components/AIAssistant/AssistantModal';
import SellerDashboard from './components/Portals/SellerDashboard';
import AdminModerator from './components/Portals/AdminModerator';
import CartCheckout from './components/Checkout/CartCheckout';

export default function App() {
  const [portalView, setPortalView] = useState("consumer"); // consumer, seller, admin
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedStreamIdx, setSelectedStreamIdx] = useState(0);
  const [activeCameraAngle, setActiveCameraAngle] = useState(0);
  
  // Custom interactive catalog states
  const [activeStream, setActiveStream] = useState(mockStreams[selectedStreamIdx]);
  const [catalogProducts, setCatalogProducts] = useState(mockProducts);
  const [similarItems, setSimilarItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(null);
  
  // Modals / Details overlays
  const [detailProduct, setDetailProduct] = useState(null);

  const handleStreamChange = (idx) => {
    setSelectedStreamIdx(idx);
    setActiveStream(mockStreams[idx]);
    setActiveCameraAngle(0);
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // AI discovery filters callback
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    let filtered = [...mockProducts];

    if (newFilters.categories.length > 0) {
      filtered = filtered.filter(p => newFilters.categories.includes(p.category));
    }
    filtered = filtered.filter(p => p.price <= newFilters.maxPrice);
    if (newFilters.minRating) {
      filtered = filtered.filter(p => p.rating >= newFilters.minRating);
    }
    if (newFilters.deliverySpeed === "1 Day") {
      filtered = filtered.filter(p => p.deliverySpeed === "1 Day");
    }
    if (newFilters.ecoFriendly) {
      filtered = filtered.filter(p => p.sustainabilityScore >= 90);
    }
    if (newFilters.trending) {
      filtered = filtered.filter(p => p.trending === true || p.popularity >= 90);
    }

    setCatalogProducts(filtered);
  };

  const handleResetFilters = () => {
    setFilters(null);
    setCatalogProducts(mockProducts);
  };

  const handleSearchResults = (products, similar) => {
    setCatalogProducts(products);
    setSimilarItems(similar);
  };

  // Reaction clicker increment
  const handleSendReaction = () => {
    setActiveStream(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
  };

  // Seller Dashboard triggers
  const handlePinProduct = (prodId) => {
    setActiveStream(prev => ({
      ...prev,
      pinnedProductId: prodId
    }));
  };

  const handleCreatePoll = (newPoll) => {
    setActiveStream(prev => ({
      ...prev,
      poll: newPoll
    }));
  };

  // Calculate active filter count
  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    let count = 0;
    if (filters.categories.length > 0) count += 1;
    if (filters.maxPrice < 80000) count += 1;
    if (filters.minRating) count += 1;
    if (filters.deliverySpeed !== "all") count += 1;
    if (filters.ecoFriendly) count += 1;
    if (filters.trending) count += 1;
    return count;
  };

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className="nav-header glass">
        <div className="brand-logo">
          <Sparkles size={24} fill="currentColor" />
          <span>LiveShop AI</span>
        </div>

        {/* Portal Switcher Tabs */}
        <nav style={styles.navLinks}>
          <button 
            onClick={() => setPortalView("consumer")} 
            style={{
              ...styles.navBtn,
              color: portalView === 'consumer' ? 'white' : 'var(--text-secondary)',
              borderBottomColor: portalView === 'consumer' ? 'var(--color-pink)' : 'transparent'
            }}
          >
            <Eye size={14} /> Watch Stream
          </button>
          <button 
            onClick={() => setPortalView("seller")} 
            style={{
              ...styles.navBtn,
              color: portalView === 'seller' ? 'white' : 'var(--text-secondary)',
              borderBottomColor: portalView === 'seller' ? 'var(--color-pink)' : 'transparent'
            }}
          >
            <Video size={14} /> Seller Console
          </button>
          <button 
            onClick={() => setPortalView("admin")} 
            style={{
              ...styles.navBtn,
              color: portalView === 'admin' ? 'white' : 'var(--text-secondary)',
              borderBottomColor: portalView === 'admin' ? 'var(--color-pink)' : 'transparent'
            }}
          >
            <ShieldAlert size={14} /> Admin Portal
          </button>
        </nav>

        {/* Shopping Cart Trigger */}
        <button onClick={() => setIsCartOpen(true)} style={styles.cartIconBtn} className="custom-button-secondary">
          <ShoppingCart size={16} />
          {cart.length > 0 && <span style={styles.cartBadge}>{cart.reduce((s,i)=>s+i.quantity,0)}</span>}
        </button>
      </header>

      {/* Main Portals Panel */}

      {/* PORTAL 1: CONSUMER LIVE SHOPPING ENVIRONMENT */}
      {portalView === "consumer" && (
        <main style={styles.mainContent}>
          {/* Active streams switch strip */}
          <div style={styles.streamStrip}>
            <span style={styles.stripLabel}>Active Broadcasts:</span>
            {mockStreams.map((st, i) => (
              <button
                key={st.id}
                onClick={() => handleStreamChange(i)}
                style={{
                  ...styles.stripBtn,
                  borderColor: selectedStreamIdx === i ? 'var(--color-pink)' : 'var(--border-color)',
                  backgroundColor: selectedStreamIdx === i ? 'rgba(236,72,153,0.1)' : 'transparent'
                }}
              >
                <img src={st.seller.avatar} alt="" style={styles.stripAvatar} />
                <span>{st.seller.name}</span>
              </button>
            ))}
          </div>

          <div className="stream-grid">
            {/* Left Col: Stream Screen */}
            <div style={styles.streamCol}>
              <div style={{ position: 'relative' }}>
                <StreamPlayer 
                  stream={activeStream} 
                  activeCameraAngle={activeCameraAngle}
                  onCameraAngleChange={setActiveCameraAngle}
                />
                
                {/* Product Overlay & Live Polls */}
                <ProductOverlay
                  product={mockProducts.find(p => p.id === activeStream.pinnedProductId)}
                  poll={activeStream.poll}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </div>

              {/* Reaction deck */}
              <ReactionBar onSendReaction={handleSendReaction} />
            </div>

            {/* Right Col: Live Chat Feed */}
            <div style={styles.chatCol}>
              <LiveChat stream={activeStream} />
            </div>
          </div>

          {/* AI Discovery & Visual Scanning Block */}
          <section style={styles.discoverySection}>
            <div style={styles.discoveryGrid}>
              
              {/* Semantic search and catalog grid */}
              <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={styles.blockHeader}>
                  <Sparkles size={16} color="var(--color-cyan)" />
                  <h3 style={styles.blockTitle}>AI Discovery Catalog</h3>
                </div>

                <AISearchBar 
                  onSearchResults={handleSearchResults} 
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  activeFiltersCount={getActiveFiltersCount()}
                />

                {/* Optional Filters component slide-in */}
                {showFilters && (
                  <div style={{ marginBottom: '16px' }}>
                    <SmartFilter 
                      onApplyFilters={handleApplyFilters} 
                      onResetFilters={handleResetFilters} 
                    />
                  </div>
                )}

                {/* Catalog Grid */}
                <div style={styles.catalogGrid}>
                  {catalogProducts.length === 0 ? (
                    <div style={styles.noResults} className="glass">
                      <AlertCircle size={32} color="var(--text-muted)" />
                      <p>No products match your AI query constraints.</p>
                      <button onClick={handleResetFilters} style={styles.clearBtn}>Clear all filters</button>
                    </div>
                  ) : (
                    catalogProducts.map((p) => (
                      <div key={p.id} className="glass-card" style={styles.productCard}>
                        {p.sustainabilityScore >= 93 && (
                          <span style={styles.ecoBadge}>🌿 Eco-Friendly</span>
                        )}
                        <img src={p.image} alt={p.name} style={styles.catalogImg} />
                        <div style={styles.catalogDetails}>
                          <span style={styles.catalogBrand}>{p.brand}</span>
                          <h4 style={styles.catalogName}>{p.name}</h4>
                          <div style={styles.catalogRating}>
                            <Star size={10} fill="currentColor" color="var(--color-amber)" />
                            <span>{p.rating}</span>
                            <span style={styles.speedLabel}>• {p.deliverySpeed}</span>
                          </div>
                          <div style={styles.catalogPriceRow}>
                            <span style={styles.catalogPrice}>₹{p.price.toLocaleString()}</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                onClick={() => setDetailProduct(p)} 
                                style={styles.infoIconBtn}
                              >
                                <Info size={12} />
                              </button>
                              <button 
                                onClick={() => handleAddToCart(p)} 
                                style={styles.addCartBtn}
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Visual Similarity recommendation strip */}
                {similarItems.length > 0 && (
                  <div style={styles.similarSection} className="glass">
                    <span style={styles.subTitle}>Similar recommendations you may like:</span>
                    <div style={styles.similarRow}>
                      {similarItems.map((p) => (
                        <div key={p.id} style={styles.similarItem} onClick={() => setDetailProduct(p)}>
                          <img src={p.image} alt="" style={styles.similarImg} />
                          <div>
                            <div style={styles.similarName}>{p.name}</div>
                            <span style={styles.similarPrice}>₹{p.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visual search image scanner */}
              <div style={{ flex: 1 }}>
                <VisualSearch onProductSelect={setDetailProduct} />
              </div>

            </div>
          </section>
        </main>
      )}

      {/* PORTAL 2: SELLER DASHBOARD VIEW */}
      {portalView === "seller" && (
        <main style={styles.portalMain}>
          <SellerDashboard 
            activeStream={activeStream}
            onPinProduct={handlePinProduct}
            onCreatePoll={handleCreatePoll}
          />
        </main>
      )}

      {/* PORTAL 3: ADMIN SECURITY AUDIT & USER MODERATOR VIEW */}
      {portalView === "admin" && (
        <main style={styles.portalMain}>
          <AdminModerator />
        </main>
      )}

      {/* PRODUCT DETAILS DETAIL MODAL */}
      {detailProduct && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent} className="glass-heavy">
            <button onClick={() => setDetailProduct(null)} style={styles.modalCloseBtn}>
              <X size={20} />
            </button>

            <div style={styles.modalGrid}>
              <img src={detailProduct.image} alt={detailProduct.name} style={styles.modalImg} />
              
              <div style={styles.modalDetails}>
                <div style={styles.modalCategoryRow}>
                  <span style={styles.modalCategory}>{detailProduct.category}</span>
                  <span style={styles.modalBrand}>{detailProduct.brand}</span>
                </div>
                
                <h3 style={styles.modalTitle}>{detailProduct.name}</h3>
                
                <div style={styles.modalRatingRow}>
                  <div style={styles.modalRating}>
                    <Star size={14} fill="currentColor" color="var(--color-amber)" />
                    <span>{detailProduct.rating} Rating</span>
                  </div>
                  <span style={styles.modalTextDivider}>|</span>
                  <span>Sustainability Score: <strong>{detailProduct.sustainabilityScore}/100</strong></span>
                </div>

                <p style={styles.modalDesc}>{detailProduct.description}</p>

                <div style={styles.modalSpecs}>
                  <div style={styles.specItem}>🚚 Shipping Speed: <strong>{detailProduct.deliverySpeed}</strong></div>
                  <div style={styles.specItem}>🎨 Color: <strong>{detailProduct.color}</strong></div>
                  <div style={styles.specItem}>📐 Size: <strong>{detailProduct.size}</strong></div>
                  <div style={styles.specItem}>⭐ Popularity Factor: <strong>{detailProduct.popularity}% User Score</strong></div>
                </div>

                <div style={styles.modalBuyBlock}>
                  <div style={styles.modalPriceCol}>
                    <span style={styles.modalOldLabel}>Price</span>
                    <span style={styles.modalPrice}>₹{detailProduct.price.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleAddToCart(detailProduct);
                      setDetailProduct(null);
                    }} 
                    style={styles.modalAddBtn}
                    className="custom-button-secondary"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      handleBuyNow(detailProduct);
                      setDetailProduct(null);
                    }} 
                    style={styles.modalBuyBtn}
                    className="custom-button"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COLLAPSIBLE CONVERSATIONAL ASSISTANT */}
      <AssistantModal 
        onAddToCart={handleAddToCart}
        onShowProductDetails={setDetailProduct}
      />

      {/* CART DRAWER SLIDE-OUT */}
      {isCartOpen && (
        <CartCheckout 
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      )}
    </div>
  );
}

const styles = {
  navLinks: {
    display: 'flex',
    gap: '24px',
    height: '100%'
  },
  navBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '24px 8px 21px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cartIconBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '12px'
  },
  cartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: 'var(--color-pink)',
    color: 'white',
    fontSize: '9px',
    fontWeight: '800',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--bg-primary)'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  streamStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px 4px 24px',
    overflowX: 'auto',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  stripLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  stripBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid transparent',
    borderRadius: '20px',
    padding: '4px 12px 4px 6px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  stripAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  streamCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  chatCol: {
    height: 'calc(100% - 12px)'
  },
  portalMain: {
    flex: 1,
    backgroundColor: 'var(--bg-primary)'
  },
  discoverySection: {
    borderTop: '1px solid var(--border-color)',
    padding: '32px 24px',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  discoveryGrid: {
    display: 'flex',
    gap: '32px',
    maxWidth: '1600px',
    margin: '0 auto',
    width: '100%',
    flexWrap: 'wrap'
  },
  blockHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  blockTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '16px',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  catalogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    width: '100%'
  },
  noResults: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
    gap: '12px',
    borderRadius: '12px'
  },
  clearBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--border-color)',
    color: 'white',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  productCard: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  ecoBadge: {
    position: 'absolute',
    top: '18px',
    left: '18px',
    zIndex: 10,
    backgroundColor: 'var(--color-emerald)',
    color: 'white',
    fontSize: '8px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase'
  },
  catalogImg: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '10px'
  },
  catalogDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  catalogBrand: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  catalogName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.3',
    margin: '2px 0 4px 0',
    height: '32px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  catalogRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '10px',
    color: 'var(--text-secondary)'
  },
  speedLabel: {
    color: 'var(--color-cyan)',
    fontWeight: '600'
  },
  catalogPriceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px'
  },
  catalogPrice: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'white'
  },
  infoIconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: 'white',
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  addCartBtn: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  similarSection: {
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px dashed var(--border-color)'
  },
  subTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase'
  },
  similarRow: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto'
  },
  similarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    flexShrink: 0
  },
  similarImg: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    objectFit: 'cover'
  },
  similarName: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px'
  },
  similarPrice: {
    fontSize: '9px',
    color: 'var(--color-pink)',
    fontWeight: '700'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backdropFilter: 'blur(8px)'
  },
  modalContent: {
    maxWidth: '680px',
    width: '100%',
    borderRadius: '20px',
    position: 'relative',
    padding: '24px',
    animation: 'scale-up 0.25s cubic-bezier(0.1, 0.8, 0.3, 1)'
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer'
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  modalImg: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '1px solid var(--border-color)'
  },
  modalDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  modalCategoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  modalCategory: {
    color: 'var(--color-pink)'
  },
  modalBrand: {
    letterSpacing: '0.5px'
  },
  modalTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '18px',
    color: 'white',
    margin: '6px 0 8px 0'
  },
  modalRatingRow: {
    display: 'flex',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginBottom: '12px'
  },
  modalRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'white'
  },
  modalTextDivider: {
    color: 'var(--border-color)'
  },
  modalDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '14px'
  },
  modalSpecs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginBottom: '16px'
  },
  specItem: {},
  modalBuyBlock: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  modalPriceCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  modalOldLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  modalPrice: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'white'
  },
  modalAddBtn: {
    padding: '10px 16px',
    fontSize: '12px'
  },
  modalBuyBtn: {
    padding: '10px 20px',
    fontSize: '12px',
    background: 'linear-gradient(135deg, var(--color-pink), #db2777)'
  }
};
