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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { schemaAddTasksExtended } from "@/utils/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useTasks } from "@/hooks/useTaskManager";
import MultiSelectFormField from "../ui/multi-select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { addTask } from "@/types";

type Inputs = z.infer<typeof schemaAddTasksExtended>;

export default function DialogFormAddTasks({
  isOpen,
  setIsOpen,
  title,
  showTrigger = true,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
}) {
  const { handleTask, isLoading } = useTasks();
  const [formStep, setFormStep] = useState(0);

  const form = useForm<Inputs>({
    resolver: zodResolver(schemaAddTasksExtended),
    defaultValues: {
      title: "",
      description: "",
      typeTask: undefined,
      dueDate: "",
      dueTime: "",
      priority: undefined,
      assigned: "",
      notes: "",
      category: [],
    },
  });

  async function onSubmit(data: Inputs) {
    const taskData: addTask = {
      title: data.title,
      description: data.description,
      typeTask: data.typeTask,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      priority: data.priority,
      assigned: data.assigned || "",
      notes: data.notes,
      category: data.category,
    };
  
    await handleTask(taskData);
    setIsOpen(false);
    setFormStep(0);
    form.reset();
  }

  const categoryListTask = [
    {
      value: "administratif",
      label: "Administratif",
    },
    {
      value: "pengembangan_produk",
      label: "Pengembangan Produk / Proyek",
    },
    {
      value: "pemasaran_promosi",
      label: "Pemasaran dan Promosi",
    },
    {
      value: "keuangan_akuntansi",
      label: "Keuangan dan Akuntansi",
    },
    {
      value: "sumber_daya_manusia",
      label: "Sumber Daya Manusia (SDM)",
    },
    {
      value: "teknis_ti",
      label: "Teknis / TI",
    },
    {
      value: "penelitian_analisis",
      label: "Penelitian dan Analisis",
    },
    {
      value: "kreatif_desain",
      label: "Kreatif / Desain",
    },
    {
      value: "operasional",
      label: "Operasional",
    },
    {
      value: "hubungan_masyarakat",
      label: "Hubungan Masyarakat (PR) dan Komunikasi",
    },
    {
      value: "legal_kepatuhan",
      label: "Legal dan Kepatuhan",
    },
    {
      value: "pelayanan_pelanggan",
      label: "Pelayanan Pelanggan",
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1" variant={"outline"}>
              <Plus />
              Tasks
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="p-4">
          <DialogHeader className="border-b pb-4 px-1">
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
                            <Input
                              type="text"
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
                            <SelectItem value="tinggi">Tinggi</SelectItem>
                            <SelectItem value="sedang">Sedang</SelectItem>
                            <SelectItem value="kecil">Kecil</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frameworks</FormLabel>
                        <FormControl>
                          <MultiSelectFormField
                            options={categoryListTask}
                            onValueChange={field.onChange}
                            placeholder="Select Category"
                            variant="inverted"
                            animation={2}
                            {...field}
                            {...form.register("category")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[40px] resize-none"
                            placeholder="Type your Notes here."
                            {...field}
                            {...form.register("notes")}
                          />
                        </FormControl>
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
                  form.trigger([
                    "title",
                    "description",
                    "typeTask",
                    "dueDate",
                    "dueTime",
                  ]);

                  const titleState = form.getFieldState("title");
                  const descriptionState = form.getFieldState("description");
                  const typeTaskState = form.getFieldState("typeTask");
                  const dueDateState = form.getFieldState("dueDate");
                  const dueTime = form.getFieldState("dueTime");

                  if (!titleState.isDirty || titleState.invalid) return;
                  if (!descriptionState.isDirty || descriptionState.invalid)
                    return;
                  if (!typeTaskState.isDirty || typeTaskState.invalid) return;
                  if (!dueDateState.isDirty || dueDateState.invalid) return;
                  if (!dueTime.isDirty || dueTime.invalid) return;

                  setFormStep(1);
                }}
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center gap-1 mt-2 ">
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
                  variant={"ghost"}
                  onClick={() => {
                    setFormStep(0);
                  }}
                  className={cn("mt-2", {
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
