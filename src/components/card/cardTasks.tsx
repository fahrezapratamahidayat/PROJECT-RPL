"use client";;
import { Button } from "../ui/button";
import { GripVertical, Loader2, Plus } from "lucide-react";
import ListTasks from "../schedule/listTask";
import { useEffect, useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import AlertDeleteTask from "../alert/alertdelete";
import { TasksData } from "@/types";
import DialogAddTasks from "../form/dialogFormAddTasks";
import { useTasks } from "@/hooks/useTaskManager";
import { formatDateString } from "@/utils/date";
import DialogEditTasks from "../form/dialogFormEditTasks";

export default function CardTasks() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TasksData>({} as TasksData);
  const {
    isLoading,
    tasksList,
    handleTask,
    fetchTasks,
    handleEditTask,
    handleDeleteTask,
  } = useTasks();

  const handleAddTasks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData);
    console.log(formValues);
    await handleTask(formData);
    setModalOpen(false);
  };

  const handleDeleteTasks = async () => {
    await handleDeleteTask(selectedTask.taskId);
    setAlertActive(false);
  };

  const handleEditTasks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await handleEditTask(selectedTask.taskId, formData);
    setFormActive(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <>
      <DialogAddTasks
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Add Task"
        showTrigger={false}
        isLoading={isLoading}
        onSubmit={handleAddTasks}
      />
      <AlertDeleteTask
        isOpen={alertActive}
        setIsOpen={setAlertActive}
        data={selectedTask}
        onClickDelete={handleDeleteTasks}
      />
      <DialogEditTasks
        isOpen={formActive}
        setIsOpen={setFormActive}
        title="Edit Task"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        showTrigger={false}
        isLoading={isLoading}
        onSubmit={handleEditTasks}
      />
      <CardTaskWrapper>
        <CardTaskContainer className="flex items-center justify-between">
          <CardTaskHeader />
          <DialogContainer className="flex items-center justify-between gap-2 ">
            <Button
              className="flex items-center gap-1"
              variant={"outline"}
              onClick={() => setModalOpen(!modalOpen)}
            >
              <Plus />
              Task
            </Button>
            <Button className="px-2" variant={"ghost"}>
              <GripVertical className="text-muted-foreground" />
              <span className="sr-only">Sort</span>
            </Button>
          </DialogContainer>
        </CardTaskContainer>
        <div className="flex items-center lg:gap-2 gap-1 lg:flex-nowrap flex-wrap">
          <Button className="mt-3" variant={"outline"} size="sm">
            4 Upcoming
          </Button>
          <Button className="mt-3" variant={"outline"} size="sm">
            2 Overdue
          </Button>
          <Button className="mt-3" variant={"outline"} size="sm">
            0 completed
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px] gap-1">
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </div>
        ) : tasksList.length > 0 ? (
          tasksList.map((task: TasksData) => {
            const formattedDeadline = formatDateString(
              task.dueTime,
              "dd MMMM yyyy HH:mm:ss"
            );
            const formattedCreatedAt = formatDateString(
              task.dueDate,
              "dd MMMM yyyy HH:mm:ss"
            );
            return (
              <ListTasks
                key={task.taskId}
                title={task.title}
                description={task.description}
                deadline={formattedDeadline}
                created_At={formattedCreatedAt}
                showAlertDelete={() => {
                  setAlertActive(!alertActive);
                  setSelectedTask({
                    ...task,
                  });
                }}
                showDialogEdit={() => {
                  setFormActive(!formActive);
                  setSelectedTask({
                    ...task,
                  });
                }}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center min-h-[300px]">
            <span>Tidak ada data</span>
          </div>
        )}
      </CardTaskWrapper>
    </>
  );
}
const CardTaskWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col border px-5 py-2 rounded-lg lg:w-1/2 w-full",
      className
    )}
    {...props}
  />
));
CardTaskWrapper.displayName = "CardTaskWrapper";

const CardTaskContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between", className)}
    {...props}
  />
));
CardTaskContainer.displayName = "CardTaskContainer";

const CardTaskHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="flex flex-col" ref={ref} {...props}>
    <span className="lg:text-base text-sm font-bold">Task Priorities</span>
    <p className="text-sm text-muted-foreground">My Task Sorted By priority</p>
  </div>
));

CardTaskHeader.displayName = "CardTaskHeader";

const DialogContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between gap-2", className)}
    {...props}
  />
));
DialogContainer.displayName = "DialogContainer";
