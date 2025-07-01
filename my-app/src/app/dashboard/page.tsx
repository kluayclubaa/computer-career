// app/dashboard/page.tsx
import DashboardTable from "./dashboardtable";

export const metadata = {
  title: "Dashboard | Nemo Heal",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] p-8 font-sarabun text-[#333]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#004d40]">
          Dashboard – ข้อมูลของผู้ใช้
        </h1>
        <p className="text-sm text-slate-600">

        </p>
      </header>

      {/* ไม่ต้องส่ง props – Client Component จะดึงเอง */}
      <DashboardTable />
    </div>
  );
}
