// app/dashboard/DashboardTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ---------- types ----------
export type JourneyRow = DocumentData & {
  id: string;
  createdAt: string;           // แปลงเป็น string เพื่อแสดงง่าย
};

// ---------- UI ----------
export default function DashboardTable() {
  const [rows, setRows] = useState<JourneyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // query คอลเลกชันเรียงตาม createdAt ย้อนหลัง
    const q = query(
      collection(db, "userJourneys"),
      orderBy("createdAt", "desc"),
    );

    // subscribe real-time
    const unsub = onSnapshot(q, (snap) => {
      const list: JourneyRow[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)
            .toDate()
            .toLocaleString("th-TH"),
        };
      });
      setRows(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p>กำลังโหลด...</p>;
  if (!rows.length) return <p>ยังไม่มีข้อมูลการเดินทาง</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow bg-white">
        <thead>
          <tr className="bg-[#00796b] text-white">
            <th className="px-4 py-3 text-left">วันที่สร้าง</th>
            <th className="px-4 py-3 text-left">ข้อมูลผู้ใช้</th>
            <th className="px-4 py-3 text-left">รายละเอียดการเดินทาง</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((j) => (
            <tr
              key={j.id}
              className="hover:bg-[#e0f2f1] transition-colors border-b"
            >
              <td className="px-4 py-3 whitespace-nowrap">{j.createdAt}</td>

              <td className="px-4 py-3">
                <strong>ชื่อ:</strong> {j.user?.name || "N/A"} <br />
                <strong>อายุ:</strong> {j.user?.age || "N/A"} <br />
                <br />
                <strong>ต้องการความช่วยเหลือ:</strong>{" "}
                {j.contact?.helpNeeded || "N/A"} <br />
                <strong>Line&nbsp;ID:</strong> {j.contact?.lineId || "N/A"}{" "}
                <br />
                <strong>เบอร์โทร:</strong> {j.contact?.phone || "N/A"}
              </td>

              <td className="px-4 py-3 space-y-2">
                {renderSection("คำถามเริ่มต้น", j.questionOverlay)}
                {renderSection("ดอกไม้", j.flower)}
                {renderSection("ท้องฟ้า", j.sky)}
                {renderSection("โต๊ะปริศนา", j.table)}
                {renderSection("ตัวตน", j.self)}
                {renderSection("การเดินทางในวัยเด็ก", j.childJourney)}
                {renderSection("ข้อความจากนีโม่", j.nemo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- helper ----------
function renderSection(label: string, data?: Record<string, unknown>) {
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <details className="rounded border p-2">
      <summary className="cursor-pointer font-semibold">{label}</summary>
      <ul className="ml-4 list-disc">
        {Object.entries(data).map(([k, v]) => (
          <li key={k}>
            {k}: {String(v)}
          </li>
        ))}
      </ul>
    </details>
  );
}
