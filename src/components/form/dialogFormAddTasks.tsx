"use client";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DialogAddTasks({
  children,
  isOpen,
  setIsOpen,
  title,
  showTrigger = true,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
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
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
