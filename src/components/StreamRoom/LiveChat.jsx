import React, { useState, useEffect, useRef } from 'react';
import { Send, ShoppingBag } from 'lucide-react';

const MOCK_NAMES = ["Kabir_Roy", "NehaS", "Raj_Dev", "Anya_J", "Priya_12", "Rohan_K", "Sarah_Miller", "David_B", "Vikram_M", "Emma_W"];
const MOCK_MESSAGES = [
  "Wow, this looks super premium!",
  "Is the shipping free to Delhi?",
  "Are there any discounts active right now?",
  "Just purchased! Can't wait!",
  "How is the battery life on the watch?",
  "Show the fabric of the hoodie close-up, please!",
  "Is this brand eco-friendly?",
  "AeroBlade looks insane for coding 🔥",
  "Just added to cart! Amazing styling.",
  "Which size fits a 6ft person?",
  "Which camera angle is that? Neat!",
  "Can we pay via UPI?"
];

export default function LiveChat({ stream }) {
  const [messages, setMessages] = useState([
    { id: 1, user: "System", text: "Welcome to the Live Stream! Interactive purchasing is active. Ask questions in chat.", isSystem: true },
    { id: 2, user: "Aria Winters", text: "Hey everyone! Glad to have you here. Ask me anything about the Summer Drop!", isHost: true },
    { id: 3, user: "Karan_07", text: "Can't wait to see the recycled boots!" }
  ]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic automatic comment simulator
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const isPurchaseAlert = Math.random() > 0.8;
      let newMsg = {};

      if (isPurchaseAlert) {
        const buyer = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
        newMsg = {
          id: Date.now(),
          user: "System",
          text: `🎉 ${buyer} just purchased an item live!`,
          isSystem: true,
          isPurchase: true
        };
      } else {
        const sender = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
        const text = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
        newMsg = {
          id: Date.now(),
          user: sender,
          text
        };
      }

      setMessages(prev => [...prev.slice(-40), newMsg]); // Keep last 40 comments
    }, 4500);

    return () => clearInterval(chatInterval);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      user: "You",
      text: inputText,
      isUser: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    // Simulate host reply occasionally after 1.5 seconds
    setTimeout(() => {
      const responses = [
        "Thanks for asking! Check the pinned card on the screen to view specs/sizes.",
        "Yes! We accept all UPI apps, card types, and EMI.",
        "Shipping takes just 1 to 2 days for major cities. Super fast!",
        "Thanks for the support! 💖",
        "We are currently offering free delivery for items pinned during this stream."
      ];
      const hostReply = {
        id: Date.now() + 1,
        user: stream.seller.name,
        text: responses[Math.floor(Math.random() * responses.length)],
        isHost: true
      };
      setMessages(prev => [...prev, hostReply]);
    }, 1500);
  };

  return (
    <div style={styles.container} className="glass">
      <div style={styles.header}>
        <span style={styles.headerTitle}>Live Chat Feed</span>
        <span style={styles.audienceCount}>💬 Interactive Chat</span>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div 
                key={msg.id} 
                style={{
                  ...styles.systemMsg,
                  background: msg.isPurchase 
                    ? 'linear-gradient(90deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.05))'
                    : 'rgba(255, 255, 255, 0.03)'
                }}
              >
                {msg.isPurchase && <ShoppingBag size={12} color="var(--color-pink)" style={{ marginRight: '6px' }} />}
                <span style={{ color: msg.isPurchase ? 'var(--color-pink)' : 'var(--text-secondary)' }}>
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} style={styles.userMsg}>
              <span 
                style={{
                  ...styles.userName,
                  color: msg.isUser 
                    ? 'var(--color-cyan)' 
                    : msg.isHost 
                      ? 'var(--color-pink)' 
                      : 'var(--color-accent)'
                }}
              >
                {msg.user}
                {msg.isHost && <span style={styles.hostLabel}>Host</span>}
                {msg.isUser && <span style={styles.userLabel}>You</span>}
                <span style={styles.colon}>:</span>
              </span>
              <span style={styles.msgText}>{msg.text}</span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} style={styles.footer}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Say something to the seller..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)'
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.1)'
  },
  headerTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '14px',
    color: 'var(--text-primary)'
  },
  audienceCount: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  systemMsg: {
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: '1.4',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center'
  },
  userMsg: {
    fontSize: '13px',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  userName: {
    fontWeight: '700',
    marginRight: '6px',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  hostLabel: {
    fontSize: '9px',
    backgroundColor: 'var(--color-pink)',
    color: 'white',
    padding: '1px 4px',
    borderRadius: '3px',
    marginLeft: '4px',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  userLabel: {
    fontSize: '9px',
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    color: 'var(--color-cyan)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    padding: '1px 4px',
    borderRadius: '3px',
    marginLeft: '4px',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  colon: {
    color: 'var(--text-muted)',
    marginLeft: '2px'
  },
  msgText: {
    color: 'var(--text-primary)'
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.1)'
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    padding: '10px 14px',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  sendButton: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
