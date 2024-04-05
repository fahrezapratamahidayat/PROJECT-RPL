"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function DialogConversation({
  onChange,
  children,
  open,
  setOpen,
}: {
  onChange: any;
  children: React.ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-center text-sm gap-1 mt-5">
          <Plus className="" /> Create chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="gap-3">
          <DialogTitle>Start new chat</DialogTitle>
          <div className=" my-1 h-px bg-muted"></div>
        </DialogHeader>
        <div className="">
          <Input type="text" placeholder="Search" onChange={onChange} />
          <div className="max-h-[250px] overflow-y-auto overflow-x-hidden">
            <div className="overflow-hidden space-3 mt-5">
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
