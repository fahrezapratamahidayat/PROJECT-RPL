import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface CalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  month: number;
  setDate: (date: Date) => void;
  onMonthChange?: (date: Date) => void; // Ubah tipe parameter menjadi Date
  onYearChange?: (year: number) => void;
  year: number;
}
export default function CalendarPopover({
  open,
  onOpenChange,
  date,
  setDate,
  month,
  onMonthChange,
  onYearChange,
  year,
}: CalendarProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: id }) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className=" w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="buttons"
          fromYear={2023}
          toYear={2030}
          selected={date}
          defaultMonth={date}
          locale={id}
          year={year}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
        />
      </PopoverContent>
    </Popover>
  );
}
