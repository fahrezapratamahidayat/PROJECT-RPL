"use client";

import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
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

export default function DialogFormTasks({children} : {children: React.ReactNode} ) {
  // const { data: session, status }: { data: any; status: string } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // const handleTask = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target as HTMLFormElement);
  //   const formValues = Object.fromEntries(formData);
  //   setIsLoading(true);
    
  //   const response = await fetch("/api/addtask", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       userId: session?.user?.id,
  //       owner: session?.user?.fullname,
  //       title: formValues.taskName,
  //       description: formValues.description,
  //       deadline: formValues.dueTime,
  //       created_At: formValues.dueDate,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   setIsLoading(false);
  // };
  return (
    <>
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
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
