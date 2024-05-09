"use client";
import React, { useEffect, useState } from "react";

import { addDays, parseISO, subDays } from "date-fns";
import { CalendarEvent } from "@/components/calendar/eventCalendar";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { useTasks } from "@/hooks/useTaskManager";

export default function Page() {
  const {
    isLoading,
    tasksList,
    tasksTeam,
    fetchTasks,
    fetchTasksTeams,
    handleEditTask,
    handleDeleteTask,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
    fetchTasksTeams();
  }, [fetchTasks, fetchTasksTeams]);

  const taskEvents = tasksList.map((task) => ({
    id: task.id,
    date: parseISO(task.dueDate),
    endDate: parseISO(task.dueTime),
    title: task.title,
    color: task.attachments
  }));


  return (
    <div className="flex min-h-screen w-full flex-col ">
      <Sidebar />
      <div className="flex flex-col lg:pl-[14rem]">
        <Navbar />
        <div className="">
          <CalendarEvent events={taskEvents} />
        </div>
      </div>
    </div>
  );
}
