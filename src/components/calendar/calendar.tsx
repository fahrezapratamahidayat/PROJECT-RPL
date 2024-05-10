import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  month: number;
  setDate: (date: Date) => void;
}
export default function CalendarPopover({
  open,
  onOpenChange,
  date,
  setDate,
  month,
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
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className=" w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          fromYear={2023}
          toYear={2030}
          selected={date}
          defaultMonth={date}
          onSelect={(selectedDate) => {
            alert(selectedDate);
            if (selectedDate) {
              setDate(selectedDate);
            } else {
              console.log("Tanggal yang dipilih adalah undefined");
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
