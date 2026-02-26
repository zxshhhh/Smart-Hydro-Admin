import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
