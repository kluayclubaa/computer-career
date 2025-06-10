"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HomePage = ({ onStart }: { onStart: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const title = container.querySelector('.home-title');
      const subtitle = container.querySelector('.home-subtitle');
      const button = container.querySelector('.home-button');

      const tl = gsap.timeline();

      tl.fromTo(title, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(subtitle, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.8" 
      )
      .fromTo(button, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.75)' },
        "-=0.6" 
      );
    }
  }, []);

  const handleStartClick = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: onStart
      });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: 'black',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        padding: '5vw',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}
    >
      <h1 
        className="home-title" 
        style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
          marginBottom: '1rem',
          lineHeight: '1.3'
        }}
      >
        พร้อมออกเดินทางไปกับรถไฟขบวนนี้หรือยัง
      </h1>
      <p 
        className="home-subtitle"
        style={{
          fontSize: 'clamp(1rem, 3.5vw, 1.5rem)', 
          maxWidth: '90%',
          color: '#E0E0E0',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}
      >
        ตอบคำถามสั้นๆ เพื่อค้นพบอาชีพสายเทคโนโลยีที่ ปลายทาง
      </p>
      <button
        className="home-button"
        onClick={handleStartClick}
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 'bold',
          color: '#1a1a1a', 
          backgroundColor: '#FFFFFF', 
          padding: '1rem 2.5rem',
          borderRadius: '50px', 
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 5px 20px rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          letterSpacing: '1px',
          maxWidth: '90vw',
          whiteSpace: 'nowrap'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 255, 255, 0.3)';
        }}
      >
        รับตั๋วเดินทาง
      </button>
    </div>
  );
};

export default HomePage;
