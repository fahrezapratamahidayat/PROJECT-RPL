"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

import { addDays, subDays } from "date-fns";
import { CalendarEvent } from "@/components/calendar/eventCalendar";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <Sidebar />
      <div className="flex flex-col lg:pl-[14rem]">
        <Navbar />
        <div className="">
          <CalendarEvent
            events={[
              { date: subDays(new Date(), 6), title: "Post video" },
              { date: subDays(new Date(), 1), title: "Edit video" },
              { date: addDays(new Date(), 3), title: "Code" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
