"use client";
import { Button } from "../ui/button";
import { GripVertical, Loader2 } from "lucide-react";
import DialogFormTasks from "../form/dialogFormTasks";
import ListTasks from "../schedule/listTask";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LabelInputContainer from "../layouts/labelInputContainer";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { Suspense, useEffect, useState } from "react";
import { DialogFooter } from "../ui/dialog";
import axios from "axios";
import { ComboboxDropdownMenu } from "../dropdown/comboxDropdown";

export default function CardTasks() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status }: { data: any; status: string } = useSession();
  const [tasksList, setTasksList] = useState([]);

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
        title: formValues.taskName,
        description: formValues.description,
        deadline: formValues.dueTime,
        created_At: formValues.dueDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    snapshotData();
  };

  const handleDeleteTask = async (taskId: string) => {
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
    }
  };

  const snapshotData = async () => {
    if (!session) return;
    const respone = await axios.get(
      `http://localhost:3000/api/userdata?id=${session?.user?.id}`
    );
    setTasksList(respone.data.users);
  };

  useEffect(() => {
    snapshotData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <>
      <div className="flex flex-col border px-5 py-2 rounded-lg w-1/2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base font-bold">Task Priorities</h2>
            <p className="text-sm text-muted-foreground">
              My Task Sorted By priority
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <DialogFormTasks>
              <form className="space-y-4" onSubmit={handleTask}>
                <div className="flex flex-col space-y-2">
                  <LabelInputContainer>
                    <Label htmlFor="taskName" className="text-right">
                      Task Name
                    </Label>
                    <Input
                      id="taskName"
                      name="taskName"
                      className=""
                      type="text"
                      required
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      placeholder="Type your message here."
                      id="description"
                      name="description"
                    />
                  </LabelInputContainer>
                  <div className="flex items-center justify-between w-full gap-5">
                    <LabelInputContainer>
                      <Label htmlFor="dueDate" className="text-right">
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        className=""
                        type="datetime-local"
                        required
                      />
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="dueTime" className="text-right">
                        Due Time
                      </Label>
                      <Input
                        id="dueTime"
                        name="dueTime"
                        className=""
                        type="datetime-local"
                        required
                      />
                    </LabelInputContainer>
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
            <Button className="px-2" variant={"ghost"}>
              <GripVertical className="text-muted-foreground" />
              <span className="sr-only">Sort</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="mt-3" variant={"outline"}>
            4 Upcoming
          </Button>
          <Button className="mt-3" variant={"outline"}>
            2 Overdue
          </Button>
          <Button className="mt-3" variant={"outline"}>
            0 completed
          </Button>
        </div>
        {tasksList && tasksList.length > 0 ? (
          <>
            {tasksList.map(
              (
                task: {
                  id: string;
                  title: string;
                  description: string;
                  created_At: string;
                  deadline: string;
                },
                index: number
              ) => (
                <Suspense key={index} fallback={<h1>Loading</h1>}>
                  <ListTasks
                    key={index}
                    taskName={task.title}
                    description={task.description}
                    created_At={task.created_At}
                    deadline={task.deadline}
                    onClickDelete={() => handleDeleteTask(task.id)}
                  />
                </Suspense>
              )
            )}
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
      </div>
    </>
  );
}
