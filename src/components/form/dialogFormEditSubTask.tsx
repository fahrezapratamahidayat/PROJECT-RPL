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
import {
  schemaAddSubstask,
  schemaAddTeamsExtended,
  schemaEditSubstask,
} from "@/utils/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import MultiSelectFormField from "../ui/multi-select";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { randomId } from "@/services/task/task";
import { Module } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Inputs = z.infer<typeof schemaEditSubstask>;
export default function DialogFormEditSubTask({
  isOpen,
  setIsOpen,
  title,
  slug,
  selectedTask,
  setSelectedTask,
  onSubTaskAdded,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
  slug: string;
  selectedTask: Module;
  setSelectedTask: (task: Module) => void;
  onSubTaskAdded?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<Inputs>({
    resolver: zodResolver(schemaEditSubstask),
    defaultValues: {
      subname: "",
      description: "",
      status: "",
    },
  });
  async function onSubmit(data: Inputs) {
    const editData = {
      ...selectedTask,
      subname: data.subname,
      description: data.description,
      status: data.status,
    };
    try {
      const id = slug;
      setIsLoading(true);
      const respone = await axios.post("/api/editsub", {
        ...editData,
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
    } finally {
      form.reset();
      setIsLoading(false);
      if (onSubTaskAdded) {
        onSubTaskAdded();
      }
    }
  }

  useEffect(() => {
    form.reset({
      subname: selectedTask?.subname,
      description: selectedTask?.description,
      status: selectedTask?.status,
    });
  }, [selectedTask, form]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Sub tasks</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...form.register("status")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
