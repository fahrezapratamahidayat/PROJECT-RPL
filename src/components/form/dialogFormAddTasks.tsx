"use client";;
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { schemaAddTasksExtended } from "@/utils/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useTasks } from "@/hooks/useTaskManager";

export default function DialogAddTasks({
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
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const form = useForm<z.infer<typeof schemaAddTasksExtended>>({
    resolver: zodResolver(schemaAddTasksExtended),
    defaultValues: {
      title: "",
      description: "",
      typeTask: undefined,
      dueDate: "",
      dueTime: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schemaAddTasksExtended>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await handleTask(formData);
    form.reset();
    setIsOpen(false)
  }
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
        <DialogContent className=" p-4">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-left">{title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 1 ? (
                <>
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Task Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
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
                          <Select onValueChange={field.onChange}>
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
                              <Input type="datetime-local" {...field} />
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
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* <DialogFooter>
                    <Button className="w-full" type="submit">
                      Next
                    </Button>
                  </DialogFooter> */}
                  {isLoading ? (
                    <Button className="w-full" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </Button>
                  ) : (
                    <Button className="w-full" type="submit">
                      Create
                    </Button>
                  )}
                </>
              ) : currentStep === 2 ? (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="assignee">Penanggung Jawab</Label>
                    <Input id="assignee" name="assignee" type="text" />

                    <Label htmlFor="priority">Prioritas</Label>
                    <select
                      id="priority"
                      name="priority"
                      className="form-select mt-1 block w-full"
                    >
                      <option value="high">Tinggi</option>
                      <option value="medium">Sedang</option>
                      <option value="low">Rendah</option>
                    </select>

                    <Label htmlFor="category">Kategori</Label>
                    <Input id="category" name="category" type="text" />

                    <Label htmlFor="estimatedTime">Estimasi Waktu</Label>
                    <Input
                      id="estimatedTime"
                      name="estimatedTime"
                      type="text"
                    />

                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      className="min-h-[40px] resize-none"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant={"outline"}
                      className="w-full"
                      onClick={prevStep}
                    >
                      Kembali
                    </Button>
                    {isLoading ? (
                      <Button className="w-full" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mohon Tunggu
                      </Button>
                    ) : (
                      <Button className="w-full" type="submit">
                        Buat
                      </Button>
                    )}
                  </DialogFooter>
                </div>
              ) : null}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
