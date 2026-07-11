import React, { useState, useEffect, useRef } from 'react';
import { Camera, Volume2, VolumeX, Play, Pause, AlertCircle, RefreshCw } from 'lucide-react';

export default function StreamPlayer({ stream, activeCameraAngle, onCameraAngleChange }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [resolution, setResolution] = useState("HD (1080p)");
  const [timeLeft, setTimeLeft] = useState(899); // 15:00 minutes flash sale
  const videoRef = useRef(null);

  // Synchronize playing state with video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, stream.videoUrl, activeCameraAngle]);

  // Flash sale countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 899));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div style={styles.container} className="glass">
      {/* Video element */}
      <video
        ref={videoRef}
        src={stream.videoAngles[activeCameraAngle]}
        style={styles.video}
        autoPlay
        muted={isMuted}
        loop
        playsInline
      />

      {/* Live Badge Overlay */}
      <div style={styles.topOverlay}>
        <div style={styles.badgeRow}>
          <span className="live-badge">● LIVE</span>
          <span style={styles.metaBadge}>👁️ {stream.viewerCount.toLocaleString()}</span>
          <span style={styles.metaBadge}>🔥 {stream.likes.toLocaleString()} Likes</span>
        </div>

        {/* Quality Toggler */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            style={styles.select}
          >
            <option value="AUTO">Adaptive (AUTO)</option>
            <option value="HD (1080p)">Full HD (1080p)</option>
            <option value="HD (720p)">HD (720p)</option>
            <option value="SD (480p)">SD (480p)</option>
          </select>
        </div>
      </div>

      {/* Flash Sale Banner */}
      <div style={styles.flashBanner}>
        <span style={styles.flashText}>⚡ FLASH DEALS LIVE: EXTRA 15% OFF Pinned Products!</span>
        <span style={styles.timer}>{formatTime(timeLeft)}</span>
      </div>

      {/* Multi-Camera Angle Selector */}
      <div style={styles.cameraDeck}>
        <span style={styles.cameraTitle}>
          <Camera size={14} color="var(--color-cyan)" />
          Multi-Camera Angles
        </span>
        <div style={styles.angleRow}>
          {stream.videoAngles.map((angleUrl, idx) => (
            <button
              key={idx}
              onClick={() => onCameraAngleChange(idx)}
              style={{
                ...styles.angleButton,
                borderColor: activeCameraAngle === idx ? 'var(--color-cyan)' : 'transparent',
                backgroundColor: activeCameraAngle === idx ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: activeCameraAngle === idx ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              Cam {idx + 1}
              {activeCameraAngle === idx && <span style={styles.activeDot} />}
            </button>
          ))}
        </div>
      </div>

      {/* Video Control Overlays */}
      <div style={styles.bottomOverlay}>
        <div style={styles.titleCol}>
          <h2 style={styles.streamTitle}>{stream.title}</h2>
          <div style={styles.sellerRow}>
            <img src={stream.seller.avatar} alt={stream.seller.name} style={styles.avatar} />
            <div>
              <div style={styles.sellerName}>{stream.seller.name}</div>
              <div style={styles.sellerFollowers}>{stream.seller.followers} followers</div>
            </div>
            <button style={styles.followButton}>Follow</button>
          </div>
        </div>

        <div style={styles.controlsRow}>
          <button onClick={handleTogglePlay} style={styles.controlIconBtn}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={handleToggleMute} style={styles.controlIconBtn}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  topOverlay: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    right: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  metaBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  select: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
    color: 'var(--text-primary)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '4px',
    fontSize: '11px',
    padding: '4px 8px',
    outline: 'none',
    cursor: 'pointer'
  },
  flashBanner: {
    position: 'absolute',
    top: '60px',
    left: '16px',
    right: '16px',
    background: 'linear-gradient(to right, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
  },
  flashText: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  timer: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '0.5px'
  },
  cameraDeck: {
    position: 'absolute',
    right: '16px',
    bottom: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    zIndex: 10
  },
  cameraTitle: {
    fontSize: '10px',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  angleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  angleButton: {
    border: '1px solid transparent',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    minWidth: '76px',
    backdropFilter: 'blur(8px)'
  },
  activeDot: {
    width: '5px',
    height: '5px',
    backgroundColor: 'var(--color-cyan)',
    borderRadius: '50%',
    display: 'inline-block'
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.7) 60%, transparent 100%)',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 9
  },
  titleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '75%'
  },
  streamTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '16px',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid var(--color-accent)'
  },
  sellerName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  sellerFollowers: {
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  followButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: '10px'
  },
  controlsRow: {
    display: 'flex',
    gap: '10px'
  },
  controlIconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)'
  }
};
