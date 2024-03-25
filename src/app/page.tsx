"use client";
import CardHome from "@/components/card/cardHome";
import CardTasks from "@/components/card/cardTasks";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { Calendar, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [greetings, setGreetings] = useState("");

  useEffect(() => {
    const handleGreetings = () => {
      const date = new Date();
      const hours = date.getHours();
      if (hours < 12) {
        return "Good Morning";
      } else if (hours < 17) {
        return "Good Afternoon";
      } else if (hours < 21) {
        return "Good Evening";
      } else {
        return "Good Night";
      }
    };
    setGreetings(handleGreetings());
  }, [greetings]);
  
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="lg:pl-[15.5rem] py-7 mr-9 flex flex-col gap-4">
        <div className="border flex flex-col justify-between gap-3 px-5 py-2 rounded-lg w-full">
          <div className="flex flex-col space-y-1">
            <h1 className="text-lg font-bold ">{greetings}</h1>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor,
              pariatur.
            </p>
          </div>
          <div className="grid grid-cols-4 items-center w-full border-t justify-items-start pt-3">
            <CardHome
              icon={<ClipboardCheck className="text-blue-500 w-6 h-6" />}
              title="Completed"
              value={2}
            />
            <CardHome
              icon={<ClipboardCheck className="text-blue-500 w-6 h-6" />}
              title="In Progress"
              value={1}
            />
            <CardHome
              icon={<ClipboardCheck className="text-blue-500 w-6 h-6" />}
              title="Overdue"
              value={1}
            />
            <CardHome
              icon={<Calendar className="text-blue-500 w-6 h-6" />}
              title="Upcoming"
              value={3}
            />
          </div>
        </div>
        <div className="w-full flex items-center gap-2">
          <CardTasks />
        </div>
      </div>
    </>
  );
}
