"use client";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { TasksData } from "@/types";

export default function DialogEditTasks({
  isOpen,
  setIsOpen,
  title,
  showTrigger = true,
  onSubmit,
  isLoading,
  selectedTask,
  setSelectedTask,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedTask: TasksData;
  setSelectedTask: (task: TasksData) => void;
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1" variant={"outline"}>
              <Plus />
              Task
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className=" p-4">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-left">{title}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
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
                    setSelectedTask({
                      ...selectedTask,
                      title: e.target.value,
                    })
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
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
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
                    value={selectedTask.dueDate}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        dueDate: e.target.value,
                      })
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
                    value={selectedTask.dueTime}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        dueTime: e.target.value,
                      })
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
        </DialogContent>
      </Dialog>
    </>
  );
}
