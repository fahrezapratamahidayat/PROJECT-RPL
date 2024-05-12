'use client'

import { useState, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { useToast } from "../components/ui/use-toast";
import axios from "axios";
import { TasksData, addTask, editTask } from "@/types";
import { getTaskTeams } from '@/services/task/task';


interface UseTasksReturn {
    tasksList: TasksData[];
    tasksTeam: TasksData[];
    isLoading: boolean;
    handleTask: (taskData: addTask) => Promise<void>;
    handleDeleteTask: (taskId: string) => Promise<void>;
    handleEditTask: (taskId: string, taskData: editTask) => Promise<void>;
    fetchTasks: () => Promise<void>;
    fetchTasksTeams: () => Promise<void>;
  }

export const useTasks = (): UseTasksReturn   => {
  const [tasksList, setTasksList] = useState<TasksData[]>([]);
  const [tasksTeam, setTaskTeams] = useState<TasksData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/getTasks?user=${session?.user?.id}`);
      setTasksList(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const fetchTasksTeams = useCallback(async () => {
    if (!session?.user?.email) return;
    setIsLoading(true);
    try {
      const response = await getTaskTeams(session?.user?.email);
      setTaskTeams(response);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  const handleTask = async (taskData: addTask) => {
    if (!session) {
      toast({
        title: "Failed to add task",
        description: "Failed to add task",
        variant: "destructive",
        duration: 2000,
      })
    };
    setIsLoading(true);
    try {
      await axios.post("/api/addtask", {
        createdBy: session?.user?.id,
        ...taskData,
      });
      await fetchTasks();
      toast({
        title: "Task Added",
        description: "Task has been added successfully",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to add task",
        description: "Failed to add task",
        variant: "destructive",
        duration: 2000,
      });
    }finally {
      setIsLoading(false);
      await fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!session) return;
    setIsLoading(true);
    try {
      await axios.post("/api/deltask", {
        id,
      });
      await fetchTasks();
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete task",
        description: "Failed to delete task",
      });
    }finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async (id: string, taskData: editTask) => {
    if (!session) return;
    setIsLoading(true);
    try {
      await axios.post("/api/updatetask", {
        id,
        ...taskData,
      });
      await fetchTasks();
      toast({
        title: "Task Edited",
        description: "Task has been edited successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to edit task",
        description: "Failed to edit task",
      });
    }finally {
      setIsLoading(false);
    }
  };

  return {
    tasksList,
    tasksTeam,
    isLoading,
    handleTask,
    handleDeleteTask,
    handleEditTask,
    fetchTasks,
    fetchTasksTeams
  };
};