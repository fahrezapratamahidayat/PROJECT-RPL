'use client'

import { useState, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { useToast } from "../components/ui/use-toast";
import axios from "axios";
import { TasksData } from "@/types";


interface UseTasksReturn {
    tasksList: TasksData[];
    isLoading: boolean;
    handleTask: (taskData: FormData) => Promise<void>;
    handleDeleteTask: (taskId: string) => Promise<void>;
    handleEditTask: (taskId: string, taskData: FormData) => Promise<void>;
    fetchTasks: () => Promise<void>;
  }

export const useTasks = (): UseTasksReturn   => {
  const [tasksList, setTasksList] = useState<TasksData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    if (!session) return;
    try {
      const response = await axios.get(`/api/userdata?id=${session?.user?.id}`);
      setTasksList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  }, [session]);

  const handleTask = async (taskData: FormData) => {
    if (!session) return;
    try {
      const formValues = Object.fromEntries(taskData);
      await axios.post("/api/addtask", {
        userId: session?.user?.id,
        ...formValues,
      });
      await fetchTasks();
      toast({
        title: "Task Added",
        description: "Task has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to add task",
        description: "Failed to add task",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!session) return;
    try {
      await axios.post("/api/deltask", {
        userId: session?.user?.id,
        taskId,
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
    }
  };

  const handleEditTask = async (taskId: string, taskData: FormData) => {
    if (!session) return;
    try {
      const formValues = Object.fromEntries(taskData);
      await axios.post("/api/updatetask", {
        userId: session?.user?.id,
        taskId,
        task: formValues,
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
    }
  };

  return {
    tasksList,
    isLoading,
    handleTask,
    handleDeleteTask,
    handleEditTask,
    fetchTasks,
  };
};