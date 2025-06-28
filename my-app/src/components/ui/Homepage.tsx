"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// อัปเดต Type ของ props ให้ onStart รับ name และ age
type HomePageProps = {
  onStart: (name: string, age: string) => void;
};

const HomePage = ({ onStart }: HomePageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // เพิ่ม state สำหรับเก็บชื่อและอายุ
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const title = container.querySelector('.home-title');
      const subtitle = container.querySelector('.home-subtitle');
      // เพิ่ม selector สำหรับกล่อง input
      const inputs = container.querySelector('.home-inputs'); 
      const button = container.querySelector('.home-button');

      const tl = gsap.timeline();

      tl.fromTo(title, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(subtitle, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.9" 
      )
      // เพิ่ม animation สำหรับช่อง input
      .fromTo(inputs,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.8"
      )
      .fromTo(button, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.75)' },
        "-=0.7" 
      );
    }
  }, []);

  const handleStartClick = () => {
    // ตรวจสอบว่าผู้ใช้กรอกชื่อและอายุหรือไม่
    if (!name.trim() || !age.trim()) {
      alert('เเฮร่! บอกชื่อกับอายุก่อนสิคนเก่ง');
      return;
    }

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        // ส่งค่า name และ age กลับไปเมื่อ animation จบ
        onComplete: () => onStart(name, age) 
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
      <button></button>
      <h1 
        className="home-title" 
        style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
          marginBottom: '1rem',
          lineHeight: '1.3'
        }}
      >
        สวัสดี ยินดีคนเก่ง
        <br/> ต้อนรับสู่นีโม่ขอฮีล
      </h1>
      <p 
        className="home-subtitle"
        style={{
          fontSize: 'clamp(1rem, 3.5vw, 1.5rem)', 
          maxWidth: '90%',
          color: '#E0E0E0',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
          marginBottom: '2rem', // ปรับระยะห่าง
          lineHeight: '1.6'
        }}
      >
        เเฮร่! ว่าเเต่คนเก่งชื่ออะไรเอ่ย
      </p>

      {/* เพิ่มส่วนของ Input Fields */}
      <div 
        className="home-inputs"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '2.5rem',
        }}
      >
        <input
          type="text"
          placeholder="ชื่อของคุณ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="number"
          placeholder="อายุ"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      </div>

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
        มาร่วมเดินทางไปกับเราสิ
      </button>
    </div>
  );
};

export default HomePage;