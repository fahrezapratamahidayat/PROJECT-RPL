import { DarkModeToggle } from "@/components/dark-mode-toggle";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import DashboardView from "@/components/pages/dashboardView";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col ">
        <Sidebar />
        <div className="flex flex-col lg:pl-[14rem]">
          <Navbar />
          <DashboardView />
        </div>
      </div>
    </>
  );
}
