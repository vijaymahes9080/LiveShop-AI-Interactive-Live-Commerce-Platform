import React, { useState, useEffect } from 'react';
import { Heart, Flame, ThumbsUp, Star } from 'lucide-react';

const REACTION_TYPES = [
  { char: "❤️", icon: <Heart size={18} fill="currentColor" /> },
  { char: "🔥", icon: <Flame size={18} fill="currentColor" /> },
  { char: "👏", charLabel: "👏" },
  { char: "😮", charLabel: "😮" },
  { char: "✨", icon: <Star size={18} fill="currentColor" /> }
];

export default function ReactionBar({ onSendReaction }) {
  const [reactions, setReactions] = useState([]);

  // Generate float reaction logic
  const triggerReaction = (char) => {
    const id = Date.now() + Math.random();
    // Random side displacement (wobble offset)
    const randomLeft = Math.floor(Math.random() * 80) - 40; 
    const newReaction = {
      id,
      char,
      leftOffset: randomLeft
    };
    
    setReactions(prev => [...prev, newReaction]);
    onSendReaction();

    // Auto cleanup particles after animations finish
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2500);
  };

  // Mock audience reaction bursts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randomChar = REACTION_TYPES[Math.floor(Math.random() * REACTION_TYPES.length)].char;
        // Don't call onSendReaction (user score increase), just show floating particle
        const id = Date.now() + Math.random();
        const randomLeft = Math.floor(Math.random() * 80) - 40;
        setReactions(prev => [...prev, { id, char: randomChar, leftOffset: randomLeft }]);
        
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== id));
        }, 2500);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* Particle Renderer */}
      {reactions.map((react) => (
        <span
          key={react.id}
          className="floating-emoji"
          style={{
            transform: `translateX(${react.leftOffset}px)`,
            right: `${40 + react.leftOffset}px`
          }}
        >
          {react.char}
        </span>
      ))}

      {/* Buttons */}
      <span style={styles.label}>Send Reaction:</span>
      <div style={styles.btnRow}>
        {REACTION_TYPES.map((react, idx) => (
          <button
            key={idx}
            onClick={() => triggerReaction(react.char)}
            style={{
              ...styles.reactBtn,
              color: react.char === "❤️" ? 'var(--color-pink)' : react.char === "🔥" ? 'var(--color-amber)' : 'white'
            }}
          >
            {react.icon ? react.icon : <span style={{ fontSize: '18px' }}>{react.charLabel}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    marginTop: '12px'
  },
  label: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  btnRow: {
    display: 'flex',
    gap: '8px'
  },
  reactBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
