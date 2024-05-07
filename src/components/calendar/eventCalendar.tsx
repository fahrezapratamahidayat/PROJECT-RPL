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
  date: Date;
  title: string;
}

interface EventCalendarProps {
  events: Event[];
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
    return events.reduce((acc: { [key: string]: Event[] }, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
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
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border rounded-md p-2 text-center"
          />
        ))}
        {daysInMonth.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const todaysEvents = eventsByDate[dateKey] || [];
          return (
            <div
              key={index}
              className={clsx("border rounded-md p-2 text-center", {
                "bg-gray-200": isToday(day),
                "text-gray-900": isToday(day),
              })}
            >
              {format(day, "d")}
              {todaysEvents.map((event) => (
                <div
                  key={event.title}
                  className="bg-green-500 rounded-md text-gray-900"
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
