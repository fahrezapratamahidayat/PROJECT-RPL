import CardHome from "@/components/card/cardHome";
import CardTasks from "@/components/card/cardTasks";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import HomePage from "@/components/pages/homePage";
import { Calendar, ClipboardCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <HomePage />
    </>
  );
}
