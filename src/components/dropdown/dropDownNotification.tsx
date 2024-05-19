import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CircleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useTasks } from "@/hooks/useTaskManager";
import { TasksData } from "@/types";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function PopoverNotification() {
  const { tasksList, fetchTasks } = useTasks();
  const [overdueTasks, setOverdueTasks] = useState<TasksData[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<TasksData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const now = new Date();
    const oneDayAhead = new Date(now.getTime() + 86400000); // 1 hari ke depan
    const threeDaysAhead = new Date(now.getTime() + 259200000); // 3 hari ke depan

    const filteredTasks = tasksList.filter((task) => {
      const dueTime = new Date(task.dueTime);
      return (
        dueTime >= now &&
        dueTime <= threeDaysAhead &&
        task.statusTask !== "canceled"
      );
    });

    setUpcomingTasks(filteredTasks);
  }, [tasksList]);

  // useEffect(() => {
  //   const now = new Date();
  //   const filteredTasks = tasksList.filter(
  //     (task) =>
  //       task.dueDate &&
  //       new Date(task.dueTime) < now &&
  //       task.statusTask !== "cancel"
  //   );
  //   setOverdueTasks(filteredTasks);
  // }, [tasksList]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-7 h-7 p-0 relative" variant="ghost" size="icon">
            <Bell />
            {isClient && upcomingTasks.length > 0 && (
              <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="lg:mr-5 mr-4 mt-3 w-[350px]">
          <h1 className="text-base">Notifications</h1>
          <Separator className="my-3" />
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex gap-1 flex-col">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-5 w-5" color="red" />
                <h2 className="text-sm">
                  {task.title.charAt(0).toUpperCase() + task.title.slice(1)}{" "}
                  <span className="text-red-500">
                    {" "}
                    {formatDistanceToNow(new Date(task.dueTime), {
                      addSuffix: true,
                    })}
                  </span>
                </h2>
              </div>
              <Link href={`/schedule/${task.id}`}>
                <p className="text-sm text-muted-foreground ml-7">
                  View task details
                </p>
              </Link>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
