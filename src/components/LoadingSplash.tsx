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
          width="360"
          height="360"
          viewBox="0 0 360 360"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g transform="translate(180,180)">
            <circle
              className="ls-ring ls-ring-outer"
              r="140"
              fill="none"
              stroke="rgba(66,135,255,0.12)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle
              className="ls-ring ls-ring-middle"
              r="100"
              fill="none"
              stroke="rgba(66,135,255,0.14)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle
              className="ls-ring ls-ring-inner"
              r="60"
              fill="none"
              stroke="rgba(66,135,255,0.18)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>

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
