import React from 'react';
import { motion } from 'framer-motion';

// Bus Icon Component
const BusIcon = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M8 6v6" />
    <path d="M16 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.4 6.8 19.8 6 19 6H5c-.8 0-1.4.8-1.6 1.8L2 12v8h2" />
    <circle cx="10" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

// Map Pin Icon
const MapPinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const SplashAnimation = () => {
  // Floating particles/dots positions
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 1.5,
    size: Math.random() * 2 + 1,
  }));

  // Moving bus particles
  const buses = [
    { id: 1, startX: '10%', startY: '20%', endX: '90%', endY: '80%', delay: 1, duration: 8 },
    { id: 2, startX: '85%', startY: '15%', endX: '15%', endY: '85%', delay: 1.5, duration: 10 },
    { id: 3, startX: '20%', startY: '75%', endX: '80%', endY: '25%', delay: 2, duration: 9 },
    { id: 4, startX: '75%', startY: '70%', endX: '25%', endY: '30%', delay: 2.5, duration: 11 },
  ];

  // Road symbols (lines)
  const roads = [
    { id: 1, x: '15%', y: '25%', rotation: 45, length: 120 },
    { id: 2, x: '80%', y: '30%', rotation: -30, length: 100 },
    { id: 3, x: '25%', y: '70%', rotation: 60, length: 110 },
    { id: 4, x: '75%', y: '65%', rotation: -45, length: 105 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-screen overflow-hidden z-50">
      {/* Background - Fades in from white to soft light-blue gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: 'easeOut',
        }}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e6f2ff 100%)',
        }}
      />

      {/* Road symbols - Blue and opaque */}
      {roads.map((road) => (
        <motion.div
          key={road.id}
          className="absolute"
          style={{
            left: road.x,
            top: road.y,
            width: `${road.length}px`,
            height: '2px',
            backgroundColor: 'rgba(77, 159, 240, 0.2)',
            transform: `rotate(${road.rotation}deg)`,
            transformOrigin: 'left center',
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: [0, 0.3, 0.2],
            scaleX: [0, 1, 1],
          }}
          transition={{
            duration: 1.5,
            delay: 0.8 + road.id * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Moving bus particles */}
      {buses.map((bus) => (
        <motion.div
          key={bus.id}
          className="absolute"
          style={{
            color: '#4D9FF0',
            opacity: 0.25,
          }}
          initial={{
            x: bus.startX,
            y: bus.startY,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            x: [bus.startX, bus.endX],
            y: [bus.startY, bus.endY],
            opacity: [0, 0.3, 0.25],
            rotate: [0, 360],
          }}
          transition={{
            x: {
              duration: bus.duration,
              delay: bus.delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            },
            y: {
              duration: bus.duration,
              delay: bus.delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            },
            opacity: {
              duration: 1,
              delay: bus.delay,
              ease: 'easeOut',
            },
            rotate: {
              duration: bus.duration,
              delay: bus.delay,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          <BusIcon className="w-5 h-5 md:w-6 md:h-6" />
        </motion.div>
      ))}

      {/* Very faint floating particles/dots */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: '#4D9FF0',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.15, 0.1],
            scale: [0, 1, 1],
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
          }}
          transition={{
            opacity: {
              duration: 2,
              delay: particle.delay,
              ease: 'easeOut',
            },
            scale: {
              duration: 1.5,
              delay: particle.delay,
              ease: 'easeOut',
            },
            y: {
              duration: 4 + Math.random() * 2,
              delay: particle.delay + 1,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            x: {
              duration: 5 + Math.random() * 2,
              delay: particle.delay + 1,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />
      ))}

      {/* Main Logo Container - Perfectly Centered */}
      <div className="relative flex items-center justify-center">
        {/* Premium Ripple Animation - Begins after logo settles (starts at 1.5s) */}
        {[0, 1, 2, 3].map((index) => {
          const baseSize = 160;
          const staggerDelay = 1.5 + index * 0.6;
          
          return (
            <motion.div
              key={index}
              className="absolute rounded-full"
              style={{
                width: `${baseSize}px`,
                height: `${baseSize}px`,
                border: '1px solid rgba(77, 159, 240, 0.25)',
                transformOrigin: 'center center',
              }}
              initial={{ 
                scale: 0.8, 
                opacity: 0 
              }}
              animate={{
                scale: [0.8, 2.5, 3.0],
                opacity: [0.4, 0.15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: staggerDelay,
                repeatDelay: 0,
              }}
            />
          );
        })}

        {/* Soft Glow - Appears for 1 second then fades out */}
        <motion.div
          className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(77, 159, 240, 0.3) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.8, 1.2, 1.2, 1.4],
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.4, 0.6, 1],
            ease: 'easeInOut',
            delay: 1.2,
          }}
        />

        {/* Logo Circle - Bigger size with map pin */}
        <motion.div
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(77, 159, 240, 0.15)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 4px 20px rgba(77, 159, 240, 0.1)',
          }}
          initial={{ 
            opacity: 0, 
            y: 20, 
            scale: 0.95 
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1 
          }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            type: 'spring',
            stiffness: 100,
            damping: 15,
            mass: 0.8,
          }}
        >
          {/* Logo Text - Centered and Balanced */}
          <div className="relative z-10 flex items-center justify-center">
            {/* म letter - Bold dark blue, much bigger */}
            <motion.span
              className="text-7xl md:text-9xl font-bold leading-none"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.9,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                fontFamily: '"Noto Sans Devanagari", "Mukta", Arial, sans-serif',
                color: '#1C6DD0',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}
            >
              म
            </motion.span>

            {/* Map Pin - Positioned between म and Yatri, same size as म */}
            <motion.div
              className="relative z-20 mx-2 md:mx-3"
              style={{ color: '#1C6DD0' }}
              initial={{ opacity: 0, scale: 0, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <MapPinIcon 
                style={{ 
                  width: '4.5rem', 
                  height: '4.5rem',
                }} 
                className="md:w-32 md:h-32"
              />
            </motion.div>

            {/* Yatri text - Medium dark grey/blue, much bigger */}
            <motion.span
              className="text-5xl md:text-6xl font-medium leading-none"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: '#4A5568',
                fontWeight: 500,
                letterSpacing: '0.01em',
                lineHeight: 1,
              }}
            >
              Yatri
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashAnimation;
