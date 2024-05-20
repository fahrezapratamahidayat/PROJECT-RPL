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
import { useEffect, useMemo, useState } from "react";
import { CardDialogEvents } from "../card/cardDialogEvent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import CalendarPopover from "./calendar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

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
  createdBy?: string;
  dueDate: Date;
  dueTime: Date;
  description: string;
  modules: any[];
  status: boolean;
  statusTask: string;
  teams: any[];
  title: string;
  typeTask: string;
  priority: string;
  category: string[];
  assigned: string[];
  notes: string;
  attachments: string;
}

interface EventCalendarProps {
  events?: Event[];
}

export function CalendarEvent({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [month, setMonthState] = useState(currentDate.getMonth());
  const [year, setYearState] = useState(currentDate.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newYear = parseInt(e.target.value, 10);
  //   setYearState(newYear);
  //   setCurrentDate(setYear(currentDate, newYear));
  // };

  const handleYearChange = (newYear: number) => {
    setYearState(newYear);
    setCurrentDate(setYear(currentDate, newYear));
  };

  const handleMonthChange = (newMonth: number) => {
    setMonthState(newMonth);
    setCurrentDate(setMonth(currentDate, newMonth));
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
        start: event.dueDate,
        end: event.dueTime || event.dueDate,
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
  const currentMonthName = format(currentDate, "MMMM", { locale: id });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleMonthChangePopover = (date: Date) => {
    const newMonth = date.getMonth();
    setMonthState(newMonth);
    setCurrentDate(setMonth(currentDate, newMonth));
  };

  const decrementMonth = () => {
    const newMonth = month - 1;
    handleMonthChange(newMonth >= 0 ? newMonth : 11);
    if (newMonth < 0) {
      handleYearChange(year - 1);
    }
  };

  const incrementMonth = () => {
    const newMonth = month + 1;
    handleMonthChange(newMonth <= 11 ? newMonth : 0);
    if (newMonth > 11) {
      handleYearChange(year + 1);
    }
  };

  useEffect(() => {}, [currentDate, month, year]);

  return (
    <>
      <div className="p-4 w-full">
        <div className="mb-4 flex justify-between items-center">
          <CalendarPopover
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            date={currentDate}
            setDate={setCurrentDate}
            month={month}
            year={year}
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChangePopover}
          />
          <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="p-2 rounded-full transition-colors"
              onClick={decrementMonth}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="p-2 rounded-full transition-colors"
              onClick={incrementMonth}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="w-[600px] md:w-full sm:w-full lg:w-full">
          <div className="grid grid-cols-7 md:w-full sm:w-full lg:w-full w-max">
            {WEEKDAYS.map((day) => (
              <div key={day} className="font-bold text-center mb-2">
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
                  className={cn(
                    `border h-[300px] w-[150px] sm:w-full md:w-full lg:w-full relative`,
                    {
                      "bg-secondarysss": todaysEvents.length > 0,
                      border: !todaysEvents.some((event) => {
                        const eventStart = format(event.dueDate, "yyyy-MM-dd");
                        const eventEnd = event.dueTime
                          ? format(event.dueTime, "yyyy-MM-dd")
                          : eventStart;
                        return dateKey >= eventStart && dateKey <= eventEnd;
                      }),
                    }
                  )}
                >
                  <div className="flex items-center justify-center px-3 py-2">
                    <span
                      className={cn(
                        "text-base text-white px-1.5 py-0.5 rounded-full",
                        {
                          " bg-blue-500": isToday(day),
                        }
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 absolute top-12 left-0 right-0">
                    {todaysEvents.map((event) => {
                      const eventStart = format(event.dueDate, "yyyy-MM-dd");
                      const eventEnd = event.dueTime
                        ? format(event.dueTime, "yyyy-MM-dd")
                        : eventStart;
                      if (dateKey === eventStart) {
                        return (
                          <div
                            key={event.title}
                            style={{ backgroundColor: event.attachments }}
                            onClick={() => handleEventClick(event)}
                            className="cursor-pointer p-2"
                          >
                            <span className="text-sm text-white font-semibold">
                              {event.title}
                            </span>
                            {isDialogOpen &&
                              selectedEvent &&
                              selectedEvent.id === event.id && (
                                <CardDialogEvents
                                  data={selectedEvent}
                                  onClose={closeDialog}
                                />
                              )}
                          </div>
                        );
                      } else if (dateKey >= eventStart && dateKey <= eventEnd) {
                        return (
                          <div
                            key={event.title}
                            style={{ backgroundColor: event.attachments }}
                            onClick={() => handleEventClick(event)}
                            className="cursor-pointer"
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
