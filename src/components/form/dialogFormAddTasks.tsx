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
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function DialogAddTasks({
  isOpen,
  setIsOpen,
  title,
  showTrigger = true,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

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
            {currentStep === 1 ? (
              <>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      className="min-h-[40px] resize-none"
                      placeholder="Type your message here."
                      id="description"
                      name="description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typeTask" className="text-right">
                      Type Task
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type Task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type Task</SelectLabel>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="teams">Teams</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <div className=""></div>
                  <Button className="w-full" type="submit">
                    Next
                  </Button>
                </DialogFooter>
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
                  <Input id="estimatedTime" name="estimatedTime" type="text" />

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
        </DialogContent>
      </Dialog>
    </>
  );
}
