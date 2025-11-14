import React from 'react';
import { motion } from 'framer-motion';

// SVG icons for background elements
const BusIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 6v6" />
    <path d="M16 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.4 6.8 19.8 6 19 6H5c-.8 0-1.4.8-1.6 1.8L2 12v8h2" />
    <circle cx="10" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

const MapIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3l18 18" />
    <path d="M21 9l-6 6M3 21l6-6M9 3l6 6M21 21l-6-6M3 9l6-6" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LocationDotIcon = ({ className }) => (
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
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // Ma letter animation - forms first with a smooth scale and fade
  const maLetterVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.34, 1.56, 0.64, 1], // Elastic ease
      },
    },
  };

  // Yatri text animation - fades in and slides from right
  const yatriTextVariants = {
    hidden: { 
      opacity: 0, 
      x: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease
      },
    },
  };

  // Ripple effect variants
  const rippleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const rippleRingVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0.8,
    },
    visible: {
      scale: [0.8, 2.5, 2.8],
      opacity: [0.8, 0.4, 0],
      transition: {
        duration: 2,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.5,
      },
    },
  };

  // Floating icons animation
  const floatingIconVariants = (duration, delay, xOffset, yOffset) => ({
    hidden: {
      opacity: 0,
      scale: 0,
      x: xOffset,
      y: yOffset,
    },
    visible: {
      opacity: [0, 0.15, 0.1],
      scale: 1,
      x: [xOffset, xOffset + 20, xOffset],
      y: [yOffset, yOffset - 30, yOffset],
      rotate: [0, 10, -5, 0],
      transition: {
        opacity: {
          duration: 1,
          delay: delay,
          ease: "easeIn",
        },
        scale: {
          duration: 0.6,
          delay: delay,
          ease: [0.34, 1.56, 0.64, 1],
        },
        x: {
          duration: duration,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        y: {
          duration: duration,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: duration * 0.8,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  });

  // Subtitle animation
  const subtitleVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Animated gradient background overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#1C6DD0]/10 via-[#4D9FF0]/5 to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      {/* Floating background icons */}
      <motion.div
        className="absolute top-[12%] left-[8%] text-[#4D9FF0]"
        variants={floatingIconVariants(18, 0.8, 0, 0)}
        initial="hidden"
        animate="visible"
      >
        <BusIcon className="w-10 h-10 md:w-14 md:h-14" />
      </motion.div>

      <motion.div
        className="absolute top-[25%] right-[12%] text-[#1C6DD0]"
        variants={floatingIconVariants(22, 1.2, 0, 0)}
        initial="hidden"
        animate="visible"
      >
        <MapIcon className="w-8 h-8 md:w-12 md:h-12" />
      </motion.div>

      <motion.div
        className="absolute bottom-[18%] right-[10%] text-[#4D9FF0]"
        variants={floatingIconVariants(20, 1.5, 0, 0)}
        initial="hidden"
        animate="visible"
      >
        <LocationDotIcon className="w-9 h-9 md:w-13 md:h-13" />
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] left-[15%] text-[#1C6DD0]"
        variants={floatingIconVariants(25, 1.8, 0, 0)}
        initial="hidden"
        animate="visible"
      >
        <BusIcon className="w-7 h-7 md:w-10 md:h-10" />
      </motion.div>

      <motion.div
        className="absolute top-[40%] left-[20%] text-[#4D9FF0]"
        variants={floatingIconVariants(16, 2.0, 0, 0)}
        initial="hidden"
        animate="visible"
      >
        <LocationDotIcon className="w-6 h-6 md:w-9 md:h-9" />
      </motion.div>

      {/* Main Logo and Animation Container */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Ripple Rings Container */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={rippleContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Multiple ripple rings for depth */}
          <motion.div
            className="absolute border-2 border-[#4D9FF0] rounded-full w-32 h-32 md:w-40 md:h-40"
            variants={rippleRingVariants}
            style={{ originX: 0.5, originY: 0.5 }}
          />
          <motion.div
            className="absolute border-2 border-[#1C6DD0] rounded-full w-32 h-32 md:w-40 md:h-40"
            variants={rippleRingVariants}
            style={{ originX: 0.5, originY: 0.5 }}
          />
          <motion.div
            className="absolute border border-[#4D9FF0]/60 rounded-full w-32 h-32 md:w-40 md:h-40"
            variants={rippleRingVariants}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        </motion.div>

        {/* Central glow effect */}
        <motion.div
          className="absolute w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#1C6DD0]/20 to-[#4D9FF0]/10 rounded-full blur-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 0.6, 0.4],
          }}
          transition={{
            duration: 1.2,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />

        {/* Logo Text Container */}
        <div className="relative z-20 flex items-center justify-center">
          <motion.span
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1C6DD0] to-[#4D9FF0] drop-shadow-lg"
            variants={maLetterVariants}
            initial="hidden"
            animate="visible"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            म
          </motion.span>
          <motion.span
            className="ml-2 md:ml-3 text-5xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#1C6DD0] to-[#4D9FF0] drop-shadow-lg"
            variants={yatriTextVariants}
            initial="hidden"
            animate="visible"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Yatri
          </motion.span>
        </div>
      </div>

      {/* Subtitle */}
      <motion.p
        className="absolute bottom-[25%] md:bottom-[20%] text-base md:text-xl text-[#1C6DD0]/80 font-medium tracking-wide"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        मेरो यात्रा, सजिलो यात्रा
      </motion.p>
    </motion.div>
  );
};

export default SplashAnimation;
