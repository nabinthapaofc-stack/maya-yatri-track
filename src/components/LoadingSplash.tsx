import React, { useEffect, useState } from "react";
import "../styles/LoadingSplash.css";

type Props = {
  visible: boolean;
  /** Optional logo source. Defaults to `/animated.jpg` (place file in `public/animated.jpg`) */
  logoSrc?: string;
};

const LoadingSplash: React.FC<Props> = ({ visible, logoSrc = "/animated.jpg" }) => {
  const [mounted, setMounted] = useState<boolean>(visible);
  const [show, setShow] = useState<boolean>(visible);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // next tick allow animation classes to apply
      requestAnimationFrame(() => setShow(true));
    } else {
      // hide with fade then unmount
      setShow(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`ls-overlay fixed inset-0 z-[9999] flex items-center justify-center ${
        show ? "ls-visible" : "ls-hidden"
      }`}
      role="status"
      aria-hidden={!show}
    >
      {/* Background layer */}
      <div className="ls-bg absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* Decorative floating dots */}
      <div className="ls-dot ls-dot-a" />
      <div className="ls-dot ls-dot-b" />
      <div className="ls-dot ls-dot-c" />

      <div className="ls-content relative z-10 flex flex-col items-center gap-6 select-none">
        {/* Rings (SVG) with fade-in */}
        <svg
          className="ls-rings ls-svg-fade-in"
          width="560"
          height="560"
          viewBox="0 0 560 560"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <filter id="ls-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(280,280)">
            <circle
              className="ls-ring ls-ring-5"
              r="320"
              fill="none"
              stroke="rgba(66,135,255,0.16)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="18 1200"
              filter="url(#ls-glow)"
            />
            <circle
              className="ls-ring ls-ring-4"
              r="260"
              fill="none"
              stroke="rgba(66,135,255,0.18)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="20 980"
              filter="url(#ls-glow)"
            />
            <circle
              className="ls-ring ls-ring-outer"
              r="200"
              fill="none"
              stroke="rgba(66,135,255,0.22)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="28 900"
              filter="url(#ls-glow)"
            />
            <circle
              className="ls-ring ls-ring-middle"
              r="150"
              fill="none"
              stroke="rgba(66,135,255,0.26)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="12 660"
              filter="url(#ls-glow)"
            />
            <circle
              className="ls-ring ls-ring-inner"
              r="100"
              fill="none"
              stroke="rgba(66,135,255,0.32)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10 420"
              filter="url(#ls-glow)"
            />
          </g>
        </svg>

        {/* Particles orbiting the rings */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`ls-particle ls-particle-${i + 1}`} />
        ))}

        {/* Logo container (image with graceful fallback) */}
        <div className="ls-logo-container">
          {!imgError ? (
            <img
              src={logoSrc}
              alt="म Yatri logo"
              className="ls-logo"
              width={112}
              height={112}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="ls-logo-fallback text-[#1f4fc3] text-2xl font-extrabold">मYatri</div>
          )}
        </div>

        {/* Branding text */}
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight text-[#1f4fc3]">मYatri</div>
          <div className="text-sm text-gray-500 ls-subtitle-fade">मेरो यात्रा · मेरो यात्री</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
