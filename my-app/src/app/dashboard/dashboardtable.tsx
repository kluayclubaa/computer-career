// src/app/dashboard/DashboardTable.tsx
"use client"; // ★★★ คำสั่งสำคัญ: บอกว่านี่คือ Client Component ★★★

import React from 'react';
import { JourneyData } from '@/lib/firebase'; // Import Type ที่สร้างไว้ใน firebase.ts

// --- Props ที่ Component นี้จะได้รับ ---
type DashboardTableProps = {
  journeys: JourneyData[];
};

// --- Styles (ยกมาจาก page.tsx) ---
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '2rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: 'white',
};
const thStyle: React.CSSProperties = {
  backgroundColor: '#00796b',
  color: 'white',
  padding: '12px 15px',
  textAlign: 'left',
  borderBottom: '2px solid #004d40',
};
const tdStyle: React.CSSProperties = {
  padding: '12px 15px',
  borderBottom: '1px solid #ddd',
};

// --- Helper Component to display sections (ยกมาจาก page.tsx) ---
const DataSection: React.FC<{ title: string; data?: object }> = ({ title, data }) => {
    if (!data || Object.keys(data).length === 0) return null;
    return (
      <div style={{ marginTop: '10px' }}>
        <strong>{title}:</strong>
        <ul style={{ listStyleType: 'none', paddingLeft: '15px' }}>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>- {key}: {String(value)}</li>
          ))}
        </ul>
      </div>
    );
};


// --- Table Component ---
export default function DashboardTable({ journeys }: DashboardTableProps) {
  if (journeys.length === 0) {
    return <p style={{marginTop: '2rem', textAlign: 'center'}}>ยังไม่มีข้อมูลการเดินทาง</p>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>วันที่สร้าง</th>
            <th style={thStyle}>ข้อมูลผู้ใช้</th>
            <th style={{...thStyle, width: '50%'}}>รายละเอียดการเดินทาง</th>
          </tr>
        </thead>
        <tbody>
          {journeys.map((journey) => (
            // โค้ดส่วนนี้จะทำงานได้เพราะอยู่ใน Client Component แล้ว
            <tr key={journey.id} onMouseOver={e => e.currentTarget.style.backgroundColor='#e0f2f1'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
              <td style={tdStyle}>{journey.createdAt}</td>
              <td style={tdStyle}>
                <strong>ชื่อ:</strong> {journey.user?.name || 'N/A'}<br/>
                <strong>อายุ:</strong> {journey.user?.age || 'N/A'}<br/><br/>
                <strong>ต้องการความช่วยเหลือ:</strong> {journey.contact?.helpNeeded || 'N/A'}<br/>
                <strong>Line ID:</strong> {journey.contact?.lineId || 'N/A'}<br/>
                <strong>เบอร์โทร:</strong> {journey.contact?.phone || 'N/A'}
              </td>
              <td style={tdStyle}>
                <DataSection title="คำถามเริ่มต้น" data={journey.questionOverlay} />
                <DataSection title="ดอกไม้" data={journey.flower} />
                <DataSection title="ท้องฟ้า" data={journey.sky} />
                <DataSection title="โต๊ะปริศนา" data={journey.table} />
                <DataSection title="ตัวตน" data={journey.self} />
                <DataSection title="การเดินทางในวัยเด็ก" data={journey.childJourney} />
                <DataSection title="ข้อความจากนีโม่" data={journey.nemo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}