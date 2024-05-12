"use client";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { greetings } from "@/hooks/greetings";
import { useTasks } from "@/hooks/useTaskManager";
import { useEffect, useMemo } from "react";

export default function CardTaskDashboard() {
  const { tasksList, tasksTeam, fetchTasks, fetchTasksTeams } = useTasks();

  useEffect(() => {
    fetchTasks();
    fetchTasksTeams();
  },[fetchTasks, fetchTasksTeams])

  const taskCounts = useMemo(() => {
    const combinedTasks = [...tasksList, ...tasksTeam];
    const uniqueTasks = Array.from(new Set(combinedTasks.map(task => task.id)))
      .map(id => {
        return combinedTasks.find(task => task.id === id);
      });
  
    const totalTasks = uniqueTasks.length;
    const ongoing = tasksList.filter(task => task.statusTask === 'on going').length + tasksTeam.filter(task => task.statusTask === 'on going').length;
    const pending = tasksList.filter(task => task.statusTask === 'pending').length + tasksTeam.filter(task => task.statusTask === 'pending').length;
    const completed = tasksList.filter(task => task.statusTask === 'completed').length + tasksTeam.filter(task => task.statusTask === 'completed').length;
    const canceled = tasksList.filter(task => task.statusTask === 'canceled').length + tasksTeam.filter(task => task.statusTask === 'canceled').length;

    return { totalTasks, ongoing, pending, completed, canceled };
  }, [tasksList, tasksTeam]);
  return (
    <div className="border flex flex-col justify-center gap-3 px-3 py-2 rounded-lg w-full">
      <div className="flex flex-col space-y-1">
        <h1 className="text-lg font-bold ">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Halo, {greetings()}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              0.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Proggres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.ongoing}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.completed}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
