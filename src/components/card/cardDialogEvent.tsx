import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TasksData } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

export function CardDialogEvents({
  data,
  onClose,
}: {
  data: {
    id: string;
    createdBy?: string;
    dueDate: Date;
    dueTime: Date;
    description: string;
    modules: any[];
    status: boolean;
    statusTask: string;
    teams: any[];
    title: string;
    typeTask: string;
    priority: string;
    category: string[];
    assigned: string[];
    notes: string;
    attachments: string;
  };
  onClose: () => void;
}) {
  function priorityClass(priority: string) {
    switch (priority.toLowerCase()) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "text-gray-500 bg-gray-200";
    }
  }
  return (
    <Popover
      modal={true}
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent className="mr-9 min-w-[250px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Link
              href={`/schedule/${data.id}`}
              className="text-base font-bold leading-none cursor-pointer"
            >
              {data.title}
            </Link>
            <p
              className="text-sm text-muted-foreground"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data.description.length > 30
                ? data.description.substring(0, 30) + "..."
                : data.description}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold text-base">Start date:</span>
              <span className="text-sm text-muted-foreground">
                {format(data.dueDate, "dd MMMM yyyy HH:mm:ss")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold text-base">End date:</span>
              <span className="text-sm text-muted-foreground">
                {format(data.dueDate, "dd MMMM yyyy HH:mm:ss")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <span className="font-semibold text-base">Status Task:</span>
              <span className="text-sm text-muted-foreground">
                {data.statusTask}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold text-base">Prioritas:</span>
              <div className="flex">
                <span
                  className={cn(
                    "text-sm rounded py-1 px-1.5",
                    priorityClass(data.priority)
                  )}
                >
                  {data.priority.charAt(0).toUpperCase() +
                    data.priority.slice(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold text-base">Type Task:</span>
              <span className="text-sm text-muted-foreground">
                {data.typeTask.charAt(0).toUpperCase() + data.typeTask.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold text-base">Catatatan:</span>
              <span className="text-sm text-muted-foreground">
                {data.notes ? data.notes : "Tidak ada catatan"}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
