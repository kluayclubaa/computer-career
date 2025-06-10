// src/components/VideoBackground.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type VideoBackgroundProps = {
  videoSrc: string;
  audioSrc: string;
  onVideoReady: () => void;
};

const VideoBackground = ({ videoSrc, audioSrc, onVideoReady }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null); // ระบุ type ของ ref
  const audioRef = useRef<HTMLAudioElement>(null); // ระบุ type ของ ref

  useEffect(() => {
    if (videoRef.current) {
      // Fade in video
      gsap.fromTo(
        videoRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: 'power2.inOut' }
      );

      // Inform parent component when video is ready
      videoRef.current.oncanplaythrough = () => {
        onVideoReady();
      };
    }

    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      gsap.to(audioRef.current, { volume: 0.3, duration: 3, ease: 'power1.in' });
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onVideoReady]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      zIndex: -1,
      backgroundColor: 'black'
    }}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0
        }}
      />
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} loop>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default VideoBackground;