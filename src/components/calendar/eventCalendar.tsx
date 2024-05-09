import clsx from "clsx";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  setMonth,
  setYear,
} from "date-fns";
import { id } from "date-fns/locale";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
]; // ID
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(0, i), "MMMM")
);

interface Event {
  id: string;
  date: Date;
  endDate?: Date;
  title: string;
  color?: string;
}

interface EventCalendarProps {
  events?: Event[];
}

export function CalendarEvent({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [month, setMonthState] = useState(currentDate.getMonth());
  const [year, setYearState] = useState(currentDate.getFullYear());

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setYearState(newYear);
    setCurrentDate(setYear(currentDate, newYear));
  };

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const eventsByDate = useMemo(() => {
    if (!events) return {};
    return events.reduce((acc: { [key: string]: Event[] }, event) => {
      const range = eachDayOfInterval({
        start: event.date,
        end: event.endDate || event.date,
      });
      range.forEach((date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        const isEventExist = acc[dateKey].some((e) => e.id === event.id);
        if (!isEventExist) {
          acc[dateKey].push(event);
        }
      });
      return acc;
    }, {});
  }, [events]);
  const handleMonthChange = (newMonth: number) => {
    setMonthState(newMonth);
    setCurrentDate(setMonth(currentDate, newMonth));
  };
  const currentMonthName = format(currentDate, "MMMM", { locale: id });

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Select
          onValueChange={(value) => handleMonthChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder={currentMonthName} defaultValue={month} />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((name, index) => (
              <SelectItem key={name} value={index.toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="number"
          value={year}
          onChange={handleYearChange}
          className="text-center"
        />
        <h2 className="text-center">
          {format(currentDate, "MMMM yyyy", { locale: id })}
        </h2>
      </div>
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className="border p-2 text-center" />
        ))}
        {daysInMonth.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const todaysEvents = eventsByDate[dateKey] || [];
          return (
            <div
              key={index}
              className={cn("h-28 text-center", {
                "bg-secondary": todaysEvents.length > 0,
                border: !todaysEvents.some((event) => {
                  const eventStart = format(event.date, "yyyy-MM-dd");
                  const eventEnd = event.endDate
                    ? format(event.endDate, "yyyy-MM-dd")
                    : eventStart;
                  return dateKey >= eventStart && dateKey <= eventEnd;
                }),
              })}
            >
              <span
                className={cn("text-base", {
                  "text-blue-500": isToday(day),
                })}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-2">
                {todaysEvents.map((event) => {
                  const eventStart = format(event.date, "yyyy-MM-dd");
                  console.log(event.color);
                  const eventEnd = event.endDate
                    ? format(event.endDate, "yyyy-MM-dd")
                    : eventStart;
                  if (dateKey === eventStart) {
                    return (
                      <div
                        key={event.title}
                        style={{ backgroundColor: event.color }}
                        onClick={() => alert(event.title)}
                      >
                        <span className="text-sm font-semibold">{event.title}</span>
                      </div>
                    );
                  } else if (dateKey >= eventStart && dateKey <= eventEnd) {
                    return (
                      <div
                        key={event.title}
                        style={{ backgroundColor: event.color }}
                      >
                        <span className="opacity-0">{event.title}</span>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
