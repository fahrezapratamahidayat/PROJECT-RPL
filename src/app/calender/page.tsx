'use client';
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="multiple"
    />
  );
}
