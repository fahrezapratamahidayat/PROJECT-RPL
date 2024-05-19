"use client";
import { useTasks } from "@/hooks/useTaskManager";
import { Module, TasksData } from "@/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { Calendar, Notebook, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTeamsData } from "@/hooks/useTeams";
import { useSession } from "next-auth/react";
import DialogFormAddSubTask from "../form/dialogFormSubTask";
import ListTasks from "../schedule/listTask";
import { formatDateString } from "@/utils/date";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircularProgress } from "@mui/material";
import DialogFormEditSubTask from "../form/dialogFormEditSubTask";
import AlertDeleteTask from "../alert/alertdelete";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";

export default function DetailsTaskPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { tasksList, fetchTasksTeams, fetchTasks } = useTasks();
  const [filteredTask, setFilteredTask] = useState<TasksData | null>(
    {} as TasksData
  );
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Module>({} as Module);
  const [alertActive, setAlertActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const teams = useTeamsData(session?.user?.email, "teams");
  const slug = params.slug[0];

  useEffect(() => {
    fetchTasks();
    fetchTasksTeams();
  }, [fetchTasks, fetchTasksTeams]);

  useEffect(() => {
    if (filteredTask && filteredTask.modules) {
      const totalMilestones = filteredTask.modules.length;
      const completedMilestones = filteredTask.modules.filter(
        (m) => m.status === "Completed"
      ).length;
      const calculatedProgress =
        totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
      setProgress(calculatedProgress);
    }
  }, [filteredTask]);

  useEffect(() => {
    const slug = params.slug[0];
    const result = tasksList.filter((task) => task.id === slug);
    setFilteredTask(result[0]);
  }, [params.slug, tasksList]);

  const teamsOptions = teams?.map((team) => ({
    label: team.name,
    members: team.members.join(", "),
  }));

  const handledeleteSub = async () => {
    try {
      const respone = await axios.post("/api/deletesub", {
        ...selectedTask,
      });
      if (respone.status === 200) {
        toast({
          title: "Success",
          description: "Sub Task deleted successfully",
          duration: 2000,
        });
      } else {
        toast({
          title: "Failed",
          description: "Failed to delete Sub Task",
          duration: 2000,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message,
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setAlertActive(false);
      if (filteredTask) {
        fetchTasks();
      }
    }
  };
  return (
    <>
      <AlertDeleteTask
        isOpen={alertActive}
        setIsOpen={setAlertActive}
        data={selectedTask}
        onClickDelete={handledeleteSub}
        onDelete={fetchTasks}
      />
      <DialogFormEditSubTask
        slug={slug}
        isOpen={formActive}
        setIsOpen={setFormActive}
        title="Edit Sub Task"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        onSubTaskAdded={fetchTasks}
      />
      <div className="py-7 px-3 lg:px-7 gap-4">
        <div className="border flex flex-col justify-center gap-3 px-4 py-4 rounded-lg ">
          {/* <h1 className="text-2xl font-semibold">Task Details</h1> */}
          <div className="flex">
            <div className="w-3/4">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-base">Task Name</h1>
                <span className="text-sm font-medium text-muted-foreground">
                  {filteredTask?.title
                    ? filteredTask.title.charAt(0).toUpperCase() +
                      filteredTask.title.slice(1)
                    : "Title not available"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-base">Description</h1>
                <p className="text-sm font-medium text-muted-foreground text-justify">
                  {filteredTask?.description ?? "Description not available"}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  perferendis maiores, numquam culpa tempora dolorum delectus ea
                  nobis eius laborum, nisi quam sapiente. Modi, eveniet. Minima
                  assumenda iste ratione. Officia.
                </p>
              </div>
            </div>
            <div className="relative w-fit ml-auto">
              <CircularProgress
                variant="determinate"
                value={progress}
                size={100}
              />
              <div className="absolute top-10 left-1/2 -translate-x-1/2  flex items-center justify-center">
                <span className="text-sm font-medium text-white text-center">
                  {progress.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <Separator className="border" />
          <div className="flex-flex-col">
            <div className="flex items-center gap-3">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Calendar className="" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Start and end</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground">
                {filteredTask?.dueDate
                  ? format(
                      new Date(filteredTask.dueDate),
                      "dd MMMM yyyy HH:mm:ss a",
                      { locale: id }
                    )
                  : "No due date"}
              </span>
              <Separator className="border w-2 px-1 mx-2" />
              <span className="text-sm text-muted-foreground">
                {filteredTask?.dueTime
                  ? format(
                      new Date(filteredTask.dueTime),
                      "dd MMMM yyyy HH:mm:ss a",
                      { locale: id }
                    )
                  : "No due date"}
              </span>
            </div>
          </div>
          <div className="flex-flex-col">
            <div className="flex lg:gap-3 md:gap-3 sm:gap-3 items-center sm:justify-start md:justify-start lg:justify-start">
              <div className="flex items-center gap-3">
                <h1 className="text-base font-medium">Priority</h1>
                <span
                  className={cn(
                    "py-0.5 px-0.5 text-center text-muted-foreground rounded-full"
                    // priorityClass(filteredTask?.priority ?? "")
                  )}
                >
                  {filteredTask?.priority
                    ? filteredTask.priority.charAt(0).toUpperCase() +
                      filteredTask.priority.slice(1)
                    : "Priority not available"}
                </span>
              </div>
              <div className="flex-grow lg:grow-0 md:grow-0 sm:grow-0"></div>{" "}
              {/* Menambahkan elemen ini untuk mendorong elemen status ke kanan */}
              <div className="flex items-center gap-3 mr-3">
                <h1 className="text-base font-medium">Status</h1>
                <span className="text-sm text-muted-foreground">
                  {filteredTask?.statusTask
                    ? filteredTask.statusTask.charAt(0).toUpperCase() +
                      filteredTask.statusTask.slice(1)
                    : "Status not available"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-flex-col">
            <div className="flex items-center gap-3">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Users className="" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">List of teams</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground">
                {filteredTask?.assigned && filteredTask.assigned.length > 0
                  ? filteredTask.assigned.join(", ")
                  : "Teams not available"}
              </span>
            </div>
          </div>
          <div className="flex-flex-col">
            <div className="flex items-center gap-3">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Tag className="" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Category</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground">
                {filteredTask?.category && filteredTask.category.length > 0
                  ? filteredTask.category.join(", ")
                  : "Category not available"}
              </span>
            </div>
          </div>
          <div className="flex-flex-col">
            <div className="flex items-center gap-3">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Notebook className="" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Notes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground">
                {filteredTask?.notes ?? "Notes not available"}
              </span>
            </div>
          </div>
          <Separator className="border mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-1/2">
              <h1 className="font-medium text-2xl">Sub task</h1>
              <p className="text-sm text-muted-foreground">Add sub task here</p>
            </div>
            <DialogFormAddSubTask
              isOpen={modalOpen}
              setIsOpen={() => {
                if (filteredTask?.createdBy === session?.user?.id) {
                  setModalOpen(!modalOpen);
                } else {
                  toast({
                    description: "You are not allowed to add sub task",
                    variant: "destructive",
                  });
                }
              }}
              title="Add Sub Task"
              slug={slug}
              onSubTaskAdded={fetchTasks}
            />
          </div>
          <div className="max-h-[320px] overflow-auto overflow-TaskList pr-1">
            {filteredTask?.modules && filteredTask.modules.length > 0 ? (
              filteredTask.modules.map((module: Module) => {
                const formattedDeadline = formatDateString(
                  module.dueTime,
                  "dd MMMM yyyy HH:mm:ss"
                );
                const formattedCreatedAt = formatDateString(
                  module.dueDate,
                  "dd MMMM yyyy HH:mm:ss"
                );
                return (
                  <ListTasks
                    title={module.subname}
                    key={module.subid}
                    link={module.subid}
                    type="subtask"
                    deadline={module.dueTime}
                    created_At={module.dueDate}
                    description={module.description}
                    status={module.status}
                    showAlertDelete={() => {
                      setAlertActive(!alertActive);
                      setSelectedTask({
                        ...module,
                      });
                    }}
                    showDialogEdit={() => {
                      setFormActive(!formActive);
                      setSelectedTask({
                        ...module,
                      });
                    }}
                  />
                );
              })
            ) : (
              <div className="flex justify-center flex-col gap-5 items-center h-full py-5">
                <svg
                  width="184"
                  height="152"
                  viewBox="0 0 184 152"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                      <ellipse
                        fillOpacity=".8"
                        fill="#F5F5F7"
                        cx="67.797"
                        cy="106.89"
                        rx="67.797"
                        ry="12.668"
                      />
                      <path
                        d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        fill="#AEB8C2"
                      />
                      <path
                        d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z"
                        fill="url(#linearGradient-1)"
                        transform="translate(13.56)"
                      />
                      <path
                        d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        fill="#F5F5F7"
                      />
                      <path
                        d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        fill="#DCE0E6"
                      />
                    </g>
                    <path
                      d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                      fill="#DCE0E6"
                    />
                    <g transform="translate(149.65 15.383)" fill="#FFF">
                      <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                      <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                  </g>
                </svg>
                <span className="text-sm text-center">No Sub Task</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
