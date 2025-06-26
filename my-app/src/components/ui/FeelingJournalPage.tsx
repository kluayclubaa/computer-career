// src/components/ui/FeelingJournalPage.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

type JournalData = {
  story: string;
  tirednessLevel: number;
};

type FeelingJournalPageProps = {
  onComplete: (data: JournalData) => void;
  userName: string;
};

const FeelingJournalPage = ({ onComplete, userName }: FeelingJournalPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [story, setStory] = useState('');
  const [tirednessLevel, setTirednessLevel] = useState(5);

  // Animation ตอนเปิดหน้านี้
  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = () => {
    // Animation ตอนปิดหน้านี้
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        onComplete({
          story,
          tirednessLevel,
        });
      },
    });
  };
  
  // เปลี่ยนสีพื้นหลังของ slider ตามค่าที่เลือก
  const getSliderTrackColor = () => {
    const percentage = (tirednessLevel / 10) * 100;
    return `linear-gradient(to right, #80DEEA ${percentage}%, #444 ${percentage}%)`;
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}
    >
      <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        อยากเล่าอะไรได้เลยนะ {userName} <br/> นีโม่พร้อมรับฟังเสมอ
      </h2>

      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="พื้นที่สำหรับคนเก่ง..."
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '200px',
          padding: '1rem',
          fontSize: '1rem',
          color: '#1a1a1a',
          backgroundColor: '#f0f0f0',
          border: '2px solid #80DEEA',
          borderRadius: '15px',
          boxSizing: 'border-box',
          marginBottom: '2.5rem',
          resize: 'none'
        }}
      />
      
      <label htmlFor="tiredness" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        ระดับความเหนื่อยวันนี้: <strong>{tirednessLevel}</strong>
      </label>
      <input
        type="range"
        id="tiredness"
        min="0"
        max="10"
        value={tirednessLevel}
        onChange={(e) => setTirednessLevel(Number(e.target.value))}
        style={{
          width: '100%',
          maxWidth: '500px',
          marginBottom: '3rem',
          cursor: 'pointer',
          background: getSliderTrackColor(),
          height: '8px',
          WebkitAppearance: 'none',
          appearance: 'none',
          borderRadius: '5px'
        }}
      />

      <button onClick={handleSubmit} style={{
        padding: '1rem 2.5rem',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#1a1a1a',
        backgroundColor: '#80DEEA',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 4px 15px rgba(128, 222, 234, 0.4)'
      }}>
        เล่าให้นีโม่ฟัง
      </button>
    </div>
  );
};

export default FeelingJournalPage;