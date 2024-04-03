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

export default function DialogAddFormTasks({
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="">{title}</DialogTitle>
            <div className="">
              
            </div>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
