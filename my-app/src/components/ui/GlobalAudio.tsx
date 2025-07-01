"use client";
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

// สร้าง Type สำหรับ props และ ref
type Props = {
  src: string;
  volume?: number;
};

export type GlobalAudioHandle = {
  play: () => void;
};

// ใช้ forwardRef เพื่อให้ Component นี้สามารถรับ ref จากข้างนอกได้
const GlobalAudio = forwardRef<GlobalAudioHandle, Props>(({ src, volume = 0.25 }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // useImperativeHandle จะเป็นการสร้างฟังก์ชันให้ ref ที่ส่งเข้ามาสามารถเรียกใช้ได้
  useImperativeHandle(ref, () => ({
    play() {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.volume = 0; // เริ่มจากไม่มีเสียง
        audio.play().catch(console.error);
        // ค่อยๆ เพิ่มเสียงขึ้นมา
        gsap.to(audio, { volume, duration: 2.5, ease: "power2.inOut" });
      }
    },
  }));

  // Component นี้จะ render แค่ element เสียงเท่านั้น
  return <audio ref={audioRef} src={src} loop preload="auto" />;
});

// Set display name for debugging
GlobalAudio.displayName = "GlobalAudio";

export default GlobalAudio;