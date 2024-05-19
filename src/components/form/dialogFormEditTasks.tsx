"use client";
import { Button } from "../ui/button";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { TasksData, editTask } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { schemaEditTasks } from "@/utils/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiSelectFormField from "../ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTeamsData } from "@/hooks/useTeams";
import { useSession } from "next-auth/react";
import { useTasks } from "@/hooks/useTaskManager";

type Inputs = z.infer<typeof schemaEditTasks>;
export default function DialogEditTasks({
  isOpen,
  setIsOpen,
  title,
  showTrigger = true,
  selectedTask,
  setSelectedTask,
  oneEditTask,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
  selectedTask: TasksData;
  setSelectedTask: (task: TasksData) => void;
  oneEditTask?: () => void;
}) {
  const form = useForm<Inputs>({
    resolver: zodResolver(schemaEditTasks),
    defaultValues: {
      title: "",
      description: "",
      typeTask: undefined,
      dueDate: "",
      dueTime: "",
      priority: undefined,
      assigned: [],
      statusTask: undefined,
    },
  });
  const { data: session } = useSession();
  const [formStep, setFormStep] = useState(0);
  const typeTask = form.watch("typeTask");
  const { handleEditTask, isLoading } = useTasks();
  const teams = useTeamsData(session?.user?.email, typeTask as string);

  async function onSubmit(data: Inputs) {
    const editData: editTask = {
      title: data.title,
      description: data.description,
      typeTask: data.typeTask,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      priority: data.priority,
      assigned: processAssigned(data),
      statusTask: data.statusTask,
    };
    try {
      await handleEditTask(selectedTask.id, editData);
    } catch (error) {
      console.error("Error handling task:", error);
    } finally {
      form.reset();
      if (oneEditTask) oneEditTask();
    }
  }

  function processAssigned(data: Inputs): string[] {
    if (
      data.typeTask === "teams" &&
      data.assigned &&
      data.assigned.length > 0
    ) {
      const splitMember = data.assigned[0]
        .split(",")
        .map((email) => email.trim());
      return splitMember.filter((email) => email !== "");
    }
    return [];
  }
  useEffect(() => {
    form.reset({
      title: selectedTask.title || "",
      description: selectedTask.description || "",
      typeTask: selectedTask.typeTask as "personal" | "teams" | undefined,
      dueDate: selectedTask.dueDate || "",
      dueTime: selectedTask.dueTime || "",
      priority: selectedTask.priority as "High" | "Medium" | "Low" | undefined,
      assigned: selectedTask.assigned || [],
      statusTask: selectedTask.statusTask as
        | "on going"
        | "completed"
        | "pending"
        | "canceled"
        | undefined,
    });
  }, [selectedTask, form.reset, form]);
  const teamsOptions = teams?.map((team) => ({
    label: team.name + " (" + team.members.length + " members)",
    value: team.members.join(", "),
  }));
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
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative overflow-x-hidden">
                <motion.div
                  className={cn("pb-1 px-1 space-y-2", {
                    // hidden: formStep == 1,
                  })}
                  // formStep == 0 -> translateX == 0
                  // formStep == 1 -> translateX == '-100%'
                  animate={{
                    translateX: `-${formStep * 100}%`,
                  }}
                  transition={{
                    ease: "easeInOut",
                  }}
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            {...form.register("title")}
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
                    name="typeTask"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Type Task</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                          {...form.register("typeTask")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type Task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="teams">Teams</SelectItem>
                          </SelectContent>
                        </Select>
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
                </motion.div>
                <motion.div
                  className={cn(
                    "absolute top-0 left-0 right-0 pb-1 px-1 space-y-1",
                    {
                      // hidden: formStep == 0,
                    }
                  )}
                  // formStep == 0 -> translateX == 100%
                  // formStep == 1 -> translateX == 0
                  animate={{
                    translateX: `${100 - formStep * 100}%`,
                  }}
                  style={{
                    translateX: `${100 - formStep * 100}%`,
                  }}
                  transition={{
                    ease: "easeInOut",
                  }}
                >
                  {form.watch("typeTask") === "teams" && (
                    <FormField
                      control={form.control}
                      name="assigned"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Assigned</FormLabel>
                          <FormControl>
                            <MultiSelectFormField
                              options={teamsOptions}
                              onValueChange={field.onChange}
                              placeholder="Select teams"
                              popoperClassName="w-[392px]"
                              variant="inverted"
                              animation={2}
                              {...field}
                              {...form.register("assigned")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          {...form.register("priority")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="statusTask"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Status Task</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          {...form.register("statusTask")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="on going">On going</SelectItem>
                            <SelectItem value="completed">completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="canceled">cancel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
              <Button
                variant={"ghost"}
                className={cn("mt-2", {
                  hidden: formStep == 1,
                })}
                type="button"
                onClick={() => {
                  setFormStep(1);
                }}
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center gap-1">
                {isLoading ? (
                  <Button className="mt-2" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </Button>
                ) : (
                  <Button
                    className={cn({
                      hidden: formStep == 0,
                    })}
                    type="submit"
                  >
                    Create
                  </Button>
                )}
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setFormStep(0);
                  }}
                  className={cn("", {
                    hidden: formStep == 0,
                  })}
                >
                  Go Back
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
