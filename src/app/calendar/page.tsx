"use client";
import React, { useEffect, useState } from "react";

import { addDays, format, parseISO, subDays } from "date-fns";
import { CalendarEvent } from "@/components/calendar/eventCalendar";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { useTasks } from "@/hooks/useTaskManager";

export default function CalendarPage() {
  const { isLoading, tasksList, tasksTeam, fetchTasks, fetchTasksTeams } =
    useTasks();

  useEffect(() => {
    fetchTasks();
    fetchTasksTeams();
  }, [fetchTasks, fetchTasksTeams]);

  const taskEvents = tasksList.map((task) => ({
    id: task.id,
    dueDate: parseISO(task.dueDate),
    dueTime: parseISO(task.dueTime),
    title: task.title,
    color: task.attachments,
    description: task.description,
    priority: task.priority,
    category: task.category,
    assigned: task.assigned,
    typeTask: task.typeTask,
    status: task.status,
    statusTask: task.statusTask,
    teams: task.teams,
    notes: task.notes,
    attachments: task.attachments,
    modules: task.modules,
  }));

  useEffect(() => {}, [taskEvents, tasksList, tasksTeam]);
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <Sidebar />
      <div className="flex flex-col lg:pl-[14rem] w-full">
        <Navbar />
        <CalendarEvent events={taskEvents} />
      </div>
    </div>
  );
}
