"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { schemaAddSubstask, schemaAddTeamsExtended } from "@/utils/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import MultiSelectFormField from "../ui/multi-select";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { randomId } from "@/services/task/task";

type Inputs = z.infer<typeof schemaAddSubstask>;
export default function DialogFormAddSubTask({
  isOpen,
  setIsOpen,
  title,
  slug,
  onSubTaskAdded
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
  slug: string
  onSubTaskAdded?: () => void;
}) {
  const [querySearch, setQuerySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const form = useForm<Inputs>({
    resolver: zodResolver(schemaAddSubstask),
    defaultValues: {
      subname: "",
      description: "",
      dueDate: "",
      dueTime: "",
    },
  });

  async function onSubmit(data: Inputs) {
    try {
      const id = slug;
      setIsLoading(true);
      const respone = await axios.post("/api/updatesub", {
        id,
        ...data,
      });
      if (respone.data.status) {
        setIsOpen(false);
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Sub Task created successfully",
          duration: 2000,
        });
      } else {
        toast({
          title: "Failed",
          description: "Failed to create Sub Task",
          duration: 2000,
        });
      }
    } catch (error) {

    }finally{
      form.reset();
      setIsLoading(false);
      if (onSubTaskAdded) {
        onSubTaskAdded();
      }
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-1" variant={"outline"}>
            <Plus />
            Add Sub Task
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4 sm:max-w-[450px]">
          <DialogHeader className="border-b pb-4 px-1">
            <DialogTitle className="text-left">{title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className={cn("px-1 space-y-1")}>
                <FormField
                  control={form.control}
                  name="subname"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Sub Task Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          {...form.register("subname")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[40px] resize-none"
                          placeholder="Type your message here."
                          {...field}
                          {...form.register("description")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex lg:items-center items-start justify-between w-full gap-2 lg:flex-row flex-wrap sm:flex-row md:flex-row">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            {...form.register("dueDate")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueTime"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>DueTime</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            {...form.register("dueTime")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {isLoading ? (
                <Button className="mt-2 w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
              ) : (
                <Button className="w-full mt-2" type="submit">
                  Create
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
