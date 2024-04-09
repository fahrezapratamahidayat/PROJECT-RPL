"use client";
import { Button } from "../ui/button";
import { GripVertical, Loader2, Plus } from "lucide-react";
import DialogFormTasks from "../form/dialogFormAddTasks";
import ListTasks from "../schedule/listTask";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LabelInputContainer from "../layouts/labelInputContainer";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { Suspense, useEffect, useState } from "react";
import { DialogFooter } from "../ui/dialog";
import axios from "axios";
import * as React from "react";
import { cn } from "@/lib/utils";
import AlertDeleteTask from "../alert/alertdelete";
import { TasksData } from "@/types";
import { formatDate } from "@/utils/date";
import DialogAddTasks from "../form/dialogFormAddTasks";

export default function CardTasks() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status }: { data: any; status: string } = useSession();
  const [tasksList, setTasksList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TasksData>({} as TasksData);

  const handleTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData);
    setIsLoading(true);

    const response = await fetch("/api/addtask", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user?.id,
        owner: session?.user?.fullname,
        title: formValues.title,
        description: formValues.description,
        deadline: formValues.dueTime,
        created_At: formValues.dueDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    if (response.ok) {
      setModalOpen(false);
      snapshotData();
      setModalOpen(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setAlertActive(true);
    if (!session) return;
    const snapshot = await fetch("/api/deltask", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user?.id,
        taskId: taskId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (snapshot.status === 200) {
      snapshotData();
      setAlertActive(false);
    }
  };

  const handleEditTaks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormActive(true);
    if (!session) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData);
    const response = await fetch("/api/updatetask", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user?.id,
        taskId: selectedTask.taskId,
        task: formValues,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      snapshotData();
      setFormActive(false);
    }
  };

  const snapshotData = React.useCallback(async () => {
    if (!session) return;
    const respone = await axios.get(`/api/userdata?id=${session?.user?.id}`);
    setTasksList(respone.data.data);
  }, [session]);

  useEffect(() => {
    snapshotData();
  }, [session, snapshotData]);

  return (
    <>
      <DialogAddTasks
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Add Task"
        showTrigger={false}
      >
        <form className="space-y-4" onSubmit={handleTask}>
          <div className="flex flex-col space-y-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">
                Task Name
              </Label>
              <Input
                id="title"
                name="title"
                className=""
                type="text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="min-h-[40px] resize-none"
                placeholder="Type your message here."
                id="description"
                name="description"
              />
            </div>
            <div className="flex lg:items-center items-start justify-between w-full gap-2 lg:flex-row flex-wrap sm:flex-row md:flex-row">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime" className="text-right">
                  Due Time
                </Label>
                <Input
                  id="dueTime"
                  name="dueTime"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-full" type="submit">
                Create
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogAddTasks>
      <AlertDeleteTask
        isOpen={alertActive}
        setIsOpen={setAlertActive}
        data={selectedTask}
        onClickDelete={() => handleDeleteTask(selectedTask.taskId)}
      />
      <DialogFormTasks
        isOpen={formActive}
        setIsOpen={setFormActive}
        title="Edit Task"
        showTrigger={false}
      >
        <form className="space-y-4" onSubmit={handleEditTaks}>
          <div className="flex flex-col space-y-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">
                Task Name
              </Label>
              <Input
                id="title"
                name="title"
                className=""
                type="text"
                required
                value={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="min-h-[40px] resize-none"
                placeholder="Type your message here."
                id="description"
                name="description"
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="flex lg:items-center items-start justify-between w-full gap-2 lg:flex-row flex-wrap sm:flex-row md:flex-row">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  required
                  value={selectedTask.created_At}
                  onChange={(e) =>
                    setSelectedTask((prev) => ({
                      ...prev,
                      created_At: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime" className="text-right">
                  Due Time
                </Label>
                <Input
                  id="dueTime"
                  name="dueTime"
                  type="datetime-local"
                  required
                  value={selectedTask.deadline}
                  onChange={(e) =>
                    setSelectedTask((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-full" type="submit">
                Create
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogFormTasks>

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
        {tasksList && tasksList.length > 0 ? (
          <>
            {tasksList.map((task: TasksData, index: number) => (
              <Suspense key={index} fallback={<h1>Loading</h1>}>
                <ListTasks
                  key={index}
                  title={task.title}
                  description={task.description}
                  created_At={formatDate(task.created_At)}
                  deadline={formatDate(task.deadline)}
                  showDialogEdit={() => {
                    setFormActive(!formActive);
                    setSelectedTask({
                      ...task,
                    });
                  }}
                  showAlertDelete={() => {
                    setAlertActive(!alertActive);
                    setSelectedTask({
                      ...task,
                    });
                  }}
                />
              </Suspense>
            ))}
          </>
        ) : (
          <Suspense fallback={<h1>Loading</h1>}>
            <div className="flex flex-col space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-stretch">
                  <div className="flex flex-col ml-4">
                    <h2 className="text-sm font-semibold">
                      kamu belum mempunyai tasks yang harus dikerjakan
                    </h2>
                    <div className="flex items-center mt-1 gap-1.5">
                      <span className="text-sm text-muted-foreground"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
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
