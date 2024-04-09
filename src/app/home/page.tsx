import { DarkModeToggle } from "@/components/dark-mode-toggle";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import HomePage from "@/components/pages/homePage";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col ">
        <Sidebar />
        <div className="flex flex-col lg:pl-[14rem]">
          <Navbar />
          <HomePage />
        </div>
      </div>
    </>
  );
}
