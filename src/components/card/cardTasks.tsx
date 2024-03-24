"use client";
import { Button } from "../ui/button";
import {
  Calendar,
  EllipsisVertical,
  GripVertical,
  Loader2,
  Plus,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LabelInputContainer from "../layouts/labelInputContainer";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

export default function CardTasks() {
  const { data: session, status }: { data: any; status: string } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  // const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  // }

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
  };
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1" variant={"outline"}>
                  <Plus />
                  Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle className="">Create Tasks</DialogTitle>
                  {/* <DialogDescription>
                    dhahdahd
                  </DialogDescription> */}
                </DialogHeader>
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
              </DialogContent>
            </Dialog>
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
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-stretch">
              <Checkbox className="mt-0.5" />
              <div className="flex flex-col ml-4">
                <h2 className="text-sm font-semibold">
                  UI/UX Design Landing page
                </h2>
                <div className="flex items-center mt-1 gap-1.5">
                  <Calendar className="text-muted-foreground w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    30 Aug 2024 - 10:30AM
                  </span>
                </div>
              </div>
            </div>
            <Button className="px-2" variant={"ghost"}>
              <EllipsisVertical />
              <span className="sr-only">More options</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
