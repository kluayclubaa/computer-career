// src/components/ContactInfoPage.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

type ContactData = {
  helpNeeded: 'yes' | 'no';
  lineId: string;
  phone: string;
};

type ContactInfoPageProps = {
  onComplete: (data: ContactData) => void;
};

const ContactInfoPage = ({ onComplete }: ContactInfoPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [helpNeeded, setHelpNeeded] = useState<'yes' | 'no'>('yes');
  const [lineId, setLineId] = useState('');
  const [phone, setPhone] = useState('');

  // Animation ตอนเปิดหน้านี้
  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = () => {
    // ตรวจสอบว่าถ้าเลือก "ต้องการ" ต้องกรอกข้อมูลอย่างน้อย 1 อย่าง
    if (helpNeeded === 'yes' && !lineId.trim() && !phone.trim()) {
      alert('หากต้องการความช่วยเหลือ กรุณากรอกช่องทางการติดต่ออย่างน้อย 1 ช่องทางนะคะ');
      return;
    }

    // Animation ตอนปิดหน้านี้
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        onComplete({
          helpNeeded,
          lineId: helpNeeded === 'yes' ? lineId : '', // ส่งค่าว่างถ้าไม่ต้องการความช่วยเหลือ
          phone: helpNeeded === 'yes' ? phone : '',
        });
      },
    });
  };

  const showInputs = helpNeeded === 'yes';

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#FFFFFF', // พื้นหลังสีขาวตามรูป
        color: '#4A4A4A', // สีตัวอักษร
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif'
      }}
    >
      <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 'normal', marginBottom: '0.5rem' }}>
        ต้องการความช่วยเหลือไหมคะ
      </h2>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>^^</p>

      {/* Radio Buttons */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', fontSize: '1.1rem' }}>
        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            name="help"
            value="yes"
            checked={helpNeeded === 'yes'}
            onChange={() => setHelpNeeded('yes')}
            style={{ marginRight: '0.5rem', transform: 'scale(1.3)' }}
          />
          ต้องการ
        </label>
        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            name="help"
            value="no"
            checked={helpNeeded === 'no'}
            onChange={() => setHelpNeeded('no')}
            style={{ marginRight: '0.5rem', transform: 'scale(1.3)' }}
          />
          ไม่ต้องการ
        </label>
      </div>
      
      {/* Conditional Inputs */}
      <div style={{
          width: '100%',
          maxWidth: '400px',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: showInputs ? 1 : 0.5,
          transform: showInputs ? 'translateY(0)' : 'translateY(-10px)'
      }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #E0E0E0', paddingBottom: '0.5rem' }}>
            ช่องทางการติดต่อเพิ่มเติม
          </p>
          <input
            type="text"
            placeholder="ID Line"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            disabled={!showInputs}
            style={{ ...inputStyles, marginBottom: '1rem' }}
          />
          <input
            type="text"
            placeholder="เบอร์มือถือ"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!showInputs}
            style={inputStyles}
          />
      </div>

      <button onClick={handleSubmit} style={buttonStyles}>
        ยืนยันและเดินทางต่อ
      </button>
    </div>
  );
};

// Styles Objects
const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  fontSize: '1rem',
  border: '1px solid #CCCCCC',
  borderRadius: '8px',
  boxSizing: 'border-box',
  textAlign: 'center',
};

const buttonStyles: React.CSSProperties = {
  marginTop: '3rem',
  padding: '1rem 2.5rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#007AFF',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
};


export default ContactInfoPage;