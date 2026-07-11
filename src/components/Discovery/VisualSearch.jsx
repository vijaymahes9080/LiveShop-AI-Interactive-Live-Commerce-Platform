import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, UploadCloud, CheckCircle } from 'lucide-react';
import { visualPresets, processImageUpload } from '../../utils/objectDetector';
import { mockProducts } from '../../data/mockCatalog';

export default function VisualSearch({ onProductSelect }) {
  const [activePreset, setActivePreset] = useState(visualPresets[0]);
  const [hoveredBoxId, setHoveredBoxId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handlePresetSelect = (preset) => {
    setActivePreset(preset);
    setSelectedProduct(null);
    setUploadMessage("");
  };

  const handleObjectClick = (obj) => {
    const prod = mockProducts.find(p => p.id === obj.productId);
    if (prod) {
      setSelectedProduct({
        ...prod,
        confidence: obj.confidence,
        labelDetected: obj.label
      });
      onProductSelect(prod);
    }
  };

  // Mock File Upload Simulation
  const handleMockUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setUploadMessage("");
    setSelectedProduct(null);

    // Simulate scanning/upload time
    setTimeout(() => {
      setIsScanning(false);
      const scanResult = processImageUpload(file.name);
      setActivePreset(scanResult);
      setUploadMessage(`Successfully parsed ${file.name} using Vision AI!`);
      
      // Auto highlight first detected item in upload
      if (scanResult.objects.length > 0) {
        handleObjectClick(scanResult.objects[0]);
      }
    }, 2000);
  };

  return (
    <div style={styles.container} className="glass">
      <div style={styles.header}>
        <Camera size={18} color="var(--color-pink)" />
        <h3 style={styles.title}>Visual AI Shopping Scanner</h3>
      </div>
      <p style={styles.desc}>
        Select a demo look below, hover over items, and click on matching coordinates to view visually matching items instantly.
      </p>

      {/* Preset Pickers */}
      <div style={styles.presetRow}>
        {visualPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            style={{
              ...styles.presetBtn,
              borderColor: activePreset.id === preset.id ? 'var(--color-pink)' : 'var(--border-color)',
              backgroundColor: activePreset.id === preset.id ? 'rgba(236, 72, 153, 0.15)' : 'transparent'
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Upload Box */}
      <div style={styles.uploadArea}>
        <label style={styles.uploadLabel}>
          <UploadCloud size={20} color="var(--text-secondary)" />
          <span style={styles.uploadText}>Or upload your own image...</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleMockUpload}
            style={styles.fileInput}
          />
        </label>
      </div>

      {/* Scan Image Container */}
      <div style={styles.imageContainer}>
        {isScanning && (
          <div style={styles.scannerOverlay}>
            <div style={styles.spinner} />
            <span style={styles.scanText}>AI Vision Scanner Running...</span>
          </div>
        )}

        <img src={activePreset.imageUrl} alt={activePreset.name} style={styles.scanImg} />

        {/* Render Bounding Boxes */}
        {!isScanning && activePreset.objects.map((obj) => (
          <div
            key={obj.id}
            className="bounding-box"
            onClick={() => handleObjectClick(obj)}
            onMouseEnter={() => setHoveredBoxId(obj.id)}
            onMouseLeave={() => setHoveredBoxId(null)}
            style={{
              left: `${obj.box.x}%`,
              top: `${obj.box.y}%`,
              width: `${obj.box.w}%`,
              height: `${obj.box.h}%`
            }}
          >
            {(hoveredBoxId === obj.id || selectedProduct?.id === obj.productId) && (
              <span className="bounding-box-label">
                {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        ))}
      </div>

      {uploadMessage && (
        <div style={styles.successAlert}>
          <CheckCircle size={14} color="var(--color-emerald)" />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Detected Product Summary */}
      {selectedProduct && (
        <div style={styles.matchCard} className="glass">
          <div style={styles.matchHeader}>
            <span style={styles.matchLabel}>
              <Sparkles size={12} color="var(--color-pink)" />
              Detected Object details
            </span>
            <span style={styles.matchScore}>
              Match Confidence: {(selectedProduct.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div style={styles.matchContent}>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={styles.matchImg} />
            <div style={styles.matchDetails}>
              <h4 style={styles.matchName}>{selectedProduct.name}</h4>
              <span style={styles.matchPrice}>₹{selectedProduct.price.toLocaleString()}</span>
              <p style={styles.matchDesc}>Category: {selectedProduct.category} | Brand: {selectedProduct.brand}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  desc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  presetRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  presetBtn: {
    border: '1px solid transparent',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '11px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  uploadArea: {
    border: '1px dashed var(--border-color)',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  uploadText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  fileInput: {
    display: 'none'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4/3',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    backgroundColor: '#000'
  },
  scanImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(236, 72, 153, 0.2)',
    borderTopColor: 'var(--color-pink)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  scanText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: '8px',
    color: 'var(--color-emerald)',
    fontSize: '11px',
    fontWeight: '600'
  },
  matchCard: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid var(--border-glow)'
  },
  matchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  matchLabel: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'uppercase'
  },
  matchScore: {
    fontSize: '10px',
    color: 'var(--color-pink)',
    fontWeight: '700'
  },
  matchContent: {
    display: 'flex',
    gap: '12px'
  },
  matchImg: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    objectFit: 'cover'
  },
  matchDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  matchName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.2'
  },
  matchPrice: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-pink)'
  },
  matchDesc: {
    fontSize: '9px',
    color: 'var(--text-secondary)'
  }
};
