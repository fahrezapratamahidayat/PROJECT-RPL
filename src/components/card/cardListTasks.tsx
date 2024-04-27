"use client";
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

export default function CardListTasks() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TasksData>({} as TasksData);
  const { isLoading, tasksList, fetchTasks, handleEditTask, handleDeleteTask } =
    useTasks();

  const handleDeleteTasks = async () => {
    await handleDeleteTask(selectedTask.id);
    setAlertActive(false);
  };

  const handleEditTasks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await handleEditTask(selectedTask.id, formData);
    setFormActive(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <>
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
        <CardTaskContainer className="flex items-center justify-between pr-0.5">
          <CardTaskHeader />
          <DialogContainer className="flex items-center justify-between">
            <DialogAddTasks
              isOpen={modalOpen}
              setIsOpen={setModalOpen}
              title="Add Task"
              showTrigger={true}
              onTaskAdded={fetchTasks}
            />
            <Button className="px-2" variant={"ghost"}>
              <GripVertical className="text-muted-foreground" />
              <span className="sr-only">Sort</span>
            </Button>
          </DialogContainer>
        </CardTaskContainer>
        <div className="flex items-center lg:gap-2 gap-1 lg:flex-nowrap flex-wrap h-full">
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
        <div className="max-h-[320px] overflow-auto overflow-TaskList pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[12vh] gap-1">
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
                  key={task.id}
                  link={task.id}
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
            <div className="flex justify-center items-center min-h-[12vh]">
              <span>Tidak ada data</span>
            </div>
          )}
        </div>
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