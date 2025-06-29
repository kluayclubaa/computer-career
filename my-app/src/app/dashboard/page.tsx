// src/app/dashboard/page.tsx
import { getAllJourneys } from '@/lib/firebase';
import React from 'react';
import DashboardTable from './dashboardtable'; // ★ 1. Import Client Component ที่สร้างขึ้น

// --- Styles ---
const pageStyle: React.CSSProperties = {
  fontFamily: "'Sarabun', sans-serif",
  backgroundColor: '#f4f7f6',
  color: '#333',
  padding: '2rem',
  minHeight: '100vh',
};

// --- Dashboard Page (Server Component) ---
export default async function DashboardPage() {
  // ★ 2. ดึงข้อมูลฝั่ง Server เหมือนเดิม
  const journeys = await getAllJourneys();

  return (
    <div style={pageStyle}>
      <header>
        <h1 style={{ color: '#004d40', borderBottom: '3px solid #00796b', paddingBottom: '10px' }}>
          Dashboard - ข้อมูลการเดินทางของผู้ใช้
        </h1>
        <p>พบข้อมูลทั้งหมด {journeys.length} รายการ (เรียงจากล่าสุด)</p>
      </header>
      
      {/* ★ 3. ส่งข้อมูลที่ดึงได้ไปให้ Client Component แสดงผล */}
      <DashboardTable journeys={journeys} />

    
    </div>
  );
}