import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Play, Pause, Maximize2, Minimize2, MoveHorizontal, Sparkles } from 'lucide-react';

export const Product360Viewer = ({
  frames = [],
  title = "Product 360°",
  isModal = false,
  onClose
}) => {
  // Ensure we have at least 8 frames for smooth complete rotation
  const frameList = frames && frames.length > 0 ? frames : [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
  ];
  
  // Expand to minimum 8 frames if needed
  const totalFrames = frameList.length >= 8 ? frameList.length : 8;
  const normalizedFrames = Array.from({ length: totalFrames }).map((_, idx) => {
    return frameList[idx % frameList.length];
  });

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);
  const autoSpinIntervalRef = useRef(null);

  // Calculate current angle in degrees (0 - 359)
  const currentAngle = Math.round((currentFrameIndex / totalFrames) * 360);

  const getAngleLabel = (angle) => {
    if (angle >= 340 || angle <= 20) return "0° Front View";
    if (angle > 20 && angle < 70) return "45° Front-Right Angle";
    if (angle >= 70 && angle <= 110) return "90° Right Profile";
    if (angle > 110 && angle < 160) return "135° Back-Right";
    if (angle >= 160 && angle <= 200) return "180° Rear View";
    if (angle > 200 && angle < 250) return "225° Back-Left";
    if (angle >= 250 && angle <= 290) return "270° Left Profile";
    return "315° Front-Left Angle";
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    startXRef.current = e.clientX;
    startFrameRef.current = currentFrameIndex;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const sensitivity = 12; // pixels per frame
    const frameDelta = Math.floor(deltaX / sensitivity);
    
    let newIndex = (startFrameRef.current - frameDelta) % totalFrames;
    if (newIndex < 0) newIndex += totalFrames;
    setCurrentFrameIndex(newIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    startXRef.current = e.touches[0].clientX;
    startFrameRef.current = currentFrameIndex;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const sensitivity = 14;
    const frameDelta = Math.floor(deltaX / sensitivity);
    
    let newIndex = (startFrameRef.current - frameDelta) % totalFrames;
    if (newIndex < 0) newIndex += totalFrames;
    setCurrentFrameIndex(newIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Auto-spin logic
  useEffect(() => {
    if (isAutoSpinning) {
      autoSpinIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex(prev => (prev + 1) % totalFrames);
      }, 100);
    } else {
      if (autoSpinIntervalRef.current) clearInterval(autoSpinIntervalRef.current);
    }
    return () => {
      if (autoSpinIntervalRef.current) clearInterval(autoSpinIntervalRef.current);
    };
  }, [isAutoSpinning, totalFrames]);

  // Global mouse up
  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalUp);
    return () => window.removeEventListener('mouseup', handleGlobalUp);
  }, []);

  const content = (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: isFullscreenModal ? '70vh' : '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, rgba(15, 19, 28, 0.95) 75%)',
        borderRadius: isFullscreenModal ? 'var(--radius-lg)' : 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(9, 11, 16, 0.75)',
            border: '1px solid var(--border-medium)',
            backdropFilter: 'blur(12px)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--accent-primary)'
          }}
        >
          <RotateCw size={14} className={isAutoSpinning ? "animate-spin" : ""} />
          <span>360° PRECISION VIEW</span>
        </div>

        <div
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(9, 11, 16, 0.75)',
            border: '1px solid var(--border-medium)',
            backdropFilter: 'blur(12px)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}
        >
          {getAngleLabel(currentAngle)}
        </div>
      </div>

      {/* Main Image Frame with 3D angle perspective */}
      <div
        style={{
          width: '80%',
          maxWidth: '440px',
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.05s ease-out'
        }}
      >
        <img
          src={normalizedFrames[currentFrameIndex]}
          alt={`${title} - 360 degree frame ${currentFrameIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
            pointerEvents: 'none'
          }}
          loading="eager"
        />

        {/* Ambient Ring */}
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            width: '90%',
            height: '24px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Degree Dial & Compass */}
      <div
        style={{
          position: 'absolute',
          bottom: '70px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}
        >
          {currentAngle}°
        </div>
      </div>

      {/* Interaction Hint Overlay */}
      {!isDragging && !isAutoSpinning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            pointerEvents: 'none'
          }}
        >
          <MoveHorizontal size={16} className="animate-pulse" />
          <span>Drag or Swipe to Rotate 360°</span>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          gap: '8px',
          zIndex: 20
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAutoSpinning(!isAutoSpinning)}
          className="btn-icon"
          style={{
            width: '36px',
            height: '36px',
            background: isAutoSpinning ? 'var(--accent-primary)' : 'rgba(15, 19, 28, 0.85)',
            color: isAutoSpinning ? '#FFFFFF' : 'var(--text-primary)'
          }}
          title={isAutoSpinning ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
        >
          {isAutoSpinning ? <Pause size={15} /> : <Play size={15} />}
        </button>

        {!isModal && (
          <button
            onClick={() => setIsFullscreenModal(true)}
            className="btn-icon"
            style={{ width: '36px', height: '36px', background: 'rgba(15, 19, 28, 0.85)' }}
            title="View Fullscreen 360° Pod"
          >
            <Maximize2 size={15} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {content}

      {/* Fullscreen Modal View */}
      <AnimatePresence>
        {isFullscreenModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(5, 7, 12, 0.92)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setIsFullscreenModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '900px',
                height: '80vh',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullscreenModal(false)}
                className="btn-icon"
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  zIndex: 30,
                  background: 'var(--accent-rose)',
                  color: '#FFFFFF'
                }}
              >
                <Minimize2 size={16} />
              </button>
              <Product360Viewer
                frames={frames}
                title={title}
                isModal={true}
                onClose={() => setIsFullscreenModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
