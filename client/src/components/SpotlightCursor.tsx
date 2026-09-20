import React, { useEffect, useState } from 'react';

export const SpotlightCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('.bento-card') ||
          target.closest('input') ||
          target.closest('select'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const loop = () => {
      // Smooth lerp interpolation for silky 60fps tracking
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Giant Ambient Spotlight Glow (Follows cursor smoothly across the entire page) */}
      <div
        className="fixed pointer-events-none z-30 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '650px' : '500px',
          height: isHovered ? '650px' : '500px',
          background: isHovered
            ? 'radial-gradient(circle, rgba(225, 29, 72, 0.12) 0%, rgba(244, 63, 94, 0.05) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, rgba(56, 189, 248, 0.04) 40%, transparent 70%)',
          willChange: 'transform, left, top',
        }}
      />

      {/* Crisp Center Spotlight Point */}
      <div
        className="fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '40px' : '20px',
          height: isHovered ? '40px' : '20px',
          borderRadius: '50%',
          backgroundColor: isHovered ? 'rgba(225, 29, 72, 0.25)' : 'rgba(225, 29, 72, 0.15)',
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s',
          willChange: 'left, top',
        }}
      />
    </>
  );
};
