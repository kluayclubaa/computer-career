"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface VideoBackgroundProps {
  /** Path or URL of the video file */
  videoSrc: string;
  /** Optional callback when the video can play through (e.g., to hide a loader) */
  onVideoReady?: () => void;
  /** Extra Tailwind / utility classes for the wrapper */
  className?: string;
}

/**
 * Full‑screen background video without audio.
 * Renders once and fades in on mount.
 */
const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  onVideoReady = () => {},
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fade‑in animation
    gsap.fromTo(
      video,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power2.inOut" }
    );

    // Notify parent when video is ready
    const handleReady = () => onVideoReady();
    video.addEventListener("canplaythrough", handleReady, { once: true });

    return () => {
      video.removeEventListener("canplaythrough", handleReady);
    };
  }, [onVideoReady]);

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden bg-black ${className}`}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-0"
      />
    </div>
  );
};

export default VideoBackground;
