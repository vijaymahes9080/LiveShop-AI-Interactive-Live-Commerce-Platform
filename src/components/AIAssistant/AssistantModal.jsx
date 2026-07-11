import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, ShoppingCart, Info } from 'lucide-react';
import { getAssistantResponse } from '../../utils/aiEngine';

export default function AssistantModal({ onAddToCart, onShowProductDetails }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! I'm your LiveShop Personal Assistant. 🤖 Ask me anything about our products, compare specs, or check your budget!",
      suggestedQueries: ["Show organic sneakers", "Coding laptops under ₹60000", "Compare active gadgets"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simulate AI thinking & reply
    setTimeout(() => {
      setIsTyping(false);
      const updatedHistory = [...messages, userMsg];
      const botResponse = getAssistantResponse(updatedHistory, text);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse.text,
          products: botResponse.products,
          comparison: botResponse.comparison,
          suggestedQueries: botResponse.suggestedQueries
        }
      ]);
    }, 1200);
  };

  const handleSuggestClick = (q) => {
    handleSend(q);
  };

  return (
    <>
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatingBubble} className="glass-heavy">
          <Sparkles size={20} className="pulse-icon" />
          <span style={styles.bubbleText}>AI Assistant</span>
        </button>
      )}

      {/* Conversational Drawer Container */}
      {isOpen && (
        <div style={styles.container} className="glass-heavy">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerTitleRow}>
              <Sparkles size={16} color="var(--color-pink)" />
              <div style={styles.headerInfo}>
                <span style={styles.titleText}>LiveShop AI Guide</span>
                <span style={styles.statusText}>● Online & Smart</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              <X size={16} />
            </button>
          </div>

          {/* Conversation Log */}
          <div style={styles.messageLog}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={styles.botAvatar}>
                    <Sparkles size={12} color="white" />
                  </div>
                )}
                
                <div style={styles.bubbleCol}>
                  <div
                    style={{
                      ...styles.bubble,
                      backgroundColor: msg.sender === 'user' ? 'var(--color-accent)' : 'var(--bg-tertiary)',
                      borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      color: msg.sender === 'user' ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{msg.text}</p>

                    {/* Render Inline comparison tables */}
                    {msg.comparison && (
                      <div style={styles.compContainer}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              {msg.comparison.headers.map((h, i) => (
                                <th key={i} style={styles.th}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.comparison.rows.map((row, i) => (
                              <tr key={i} style={styles.tr}>
                                {row.map((cell, idx) => (
                                  <td key={idx} style={styles.td}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Render Product Cards inside bubble */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={styles.inlineProducts}>
                      {msg.products.map((p) => (
                        <div key={p.id} style={styles.miniCard} className="glass">
                          <img src={p.image} alt={p.name} style={styles.miniImg} />
                          <div style={styles.miniInfo}>
                            <div style={styles.miniName}>{p.name}</div>
                            <div style={styles.miniPriceRow}>
                              <span style={styles.miniPrice}>₹{p.price.toLocaleString()}</span>
                              <span style={styles.miniRating}>⭐ {p.rating}</span>
                            </div>
                            <div style={styles.miniActionRow}>
                              <button 
                                onClick={() => onShowProductDetails(p)} 
                                style={styles.detailsBtn}
                              >
                                <Info size={10} /> Details
                              </button>
                              <button 
                                onClick={() => onAddToCart(p)} 
                                style={styles.miniCartBtn}
                              >
                                <ShoppingCart size={10} /> Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Chip Choices */}
                  {msg.suggestedQueries && (
                    <div style={styles.inlineSuggs}>
                      {msg.suggestedQueries.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestClick(q)}
                          style={styles.suggChip}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={styles.messageRow}>
                <div style={styles.botAvatar}>
                  <Sparkles size={12} color="white" />
                </div>
                <div style={styles.typingBubble}>
                  <span style={styles.dot} />
                  <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* User Input Drawer Footer */}
          <div style={styles.footer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for recommendations, compare specifications..."
              style={styles.input}
            />
            <button onClick={() => handleSend()} style={styles.sendBtn}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  floatingBubble: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 90,
    backgroundColor: 'var(--bg-glass-heavy)',
    border: '1px solid var(--color-accent)',
    borderRadius: '30px',
    padding: '12px 20px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  bubbleText: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '0.5px'
  },
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '380px',
    height: '520px',
    zIndex: 100,
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid var(--border-glow)'
  },
  header: {
    padding: '14px 16px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.15)'
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  titleText: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    fontFamily: 'var(--font-title)'
  },
  statusText: {
    fontSize: '9px',
    color: 'var(--color-emerald)',
    fontWeight: '600'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer'
  },
  messageLog: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  messageRow: {
    display: 'flex',
    gap: '10px',
    maxWidth: '85%'
  },
  botAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '4px'
  },
  bubbleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
  },
  bubble: {
    padding: '10px 14px',
    boxShadow: 'var(--shadow-sm)',
    wordBreak: 'break-word'
  },
  inlineProducts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '4px'
  },
  miniCard: {
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    gap: '10px'
  },
  miniImg: {
    width: '42px',
    height: '42px',
    borderRadius: '4px',
    objectFit: 'cover'
  },
  miniInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  miniName: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.2'
  },
  miniPriceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-secondary)'
  },
  miniPrice: {
    color: 'var(--color-pink)',
    fontWeight: '700'
  },
  miniRating: {
    fontSize: '9px'
  },
  miniActionRow: {
    display: 'flex',
    gap: '4px',
    marginTop: '4px'
  },
  detailsBtn: {
    flex: 1,
    padding: '2px 0',
    fontSize: '9px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px'
  },
  miniCartBtn: {
    flex: 1,
    padding: '2px 0',
    fontSize: '9px',
    backgroundColor: 'var(--color-accent)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px'
  },
  inlineSuggs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '4px'
  },
  suggChip: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  compContainer: {
    marginTop: '8px',
    overflowX: 'auto',
    borderRadius: '6px',
    border: '1px solid var(--border-color)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '10px',
    color: 'var(--text-primary)'
  },
  th: {
    padding: '6px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid var(--border-color)',
    textAlign: 'left',
    fontWeight: '700'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  td: {
    padding: '6px 8px',
    textAlign: 'left'
  },
  typingBubble: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '10px 14px',
    borderRadius: '12px 12px 12px 2px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '32px'
  },
  dot: {
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--text-muted)',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce-dot 1.2s infinite ease-in-out'
  },
  footer: {
    padding: '10px 12px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '6px',
    background: 'rgba(0,0,0,0.15)'
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    padding: '8px 12px',
    fontSize: '12px',
    outline: 'none'
  },
  sendBtn: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }
};
