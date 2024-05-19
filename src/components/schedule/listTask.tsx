import { Checkbox } from "@radix-ui/react-checkbox";
import { Calendar, Dot, EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Children } from "react";
import { ComboboxDropdownMenu } from "../dropdown/comboxDropdown";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function ListTasks({
  link,
  title,
  description,
  deadline,
  created_At,
  showAlertDelete,
  showDialogEdit,
  isOverdue,
  type = "task",
  status,
  statusTask,
}: {
  title: string;
  description?: string;
  deadline: string;
  created_At: string;
  showAlertDelete: () => void;
  showDialogEdit: () => void;
  link: string;
  isOverdue?: boolean;
  type?: "task" | "subtask";
  status?: "Completed" | "Pending" | "In Progress" | "Cancel";
  statusTask?: "on going" | "pending" | "completed" | "canceled";
}) {
  return (
    <>
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-stretch">
            <div className="flex flex-col lg:ml-4">
              <div className="flex items-start lg:items-center ">
                {type === "task" ? (
                  <Link href={`/schedule/${link}`}>
                    <h2 className="text-base font-semibold">{title}</h2>
                  </Link>
                ) : (
                  <h2 className="text-base font-semibold">{title}</h2>
                )}
                {type === "task" && statusTask === "canceled" && (
                  <Badge className="ml-2" variant="destructive">
                    Canceled
                  </Badge>
                )}
                {type === "task" &&
                  statusTask === "completed" &&
                  isOverdue === false && (
                    <Badge className="ml-2 bg-success text-white">
                      Compeleted
                    </Badge>
                  )}
                {/* {type === "task" && statusTask === "on going" && (
                  <Badge className="ml-2 bg-blue-500 text-white">
                    On going
                  </Badge>
                )} */}
                {/* {type === "task" && statusTask === "pending" && (
                  <Badge className="ml-2 bg-yellow-500 text-white">
                    Pending
                  </Badge>
                )} */}
                {isOverdue && (
                  <Badge className="ml-2" variant="destructive">
                    Overdue
                  </Badge>
                )}
                {type === "subtask" && status === "Pending" && (
                  <Badge className="ml-2 bg-yellow-500 text-white">
                    Pending
                  </Badge>
                )}
                {type === "subtask" && status === "In Progress" && (
                  <Badge className="ml-2 bg-blue-500 text-white">
                    In Progress
                  </Badge>
                )}
                {type === "subtask" && status === "Completed" && (
                  <Badge className="ml-2 bg-success text-white">Success</Badge>
                )}
              </div>
              {type === "task" ? (
                <div className="flex items-start lg:items-center mt-1 gap-1.5">
                  <Calendar className="text-muted-foreground w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {created_At} - {deadline}
                  </span>
                </div>
              ) : (
                <div className="w-[370px] sm:w-full md:w-full lg:w-full">
                  <p className="text-sm text-muted-foreground break-words text-pretty">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
          <ComboboxDropdownMenu
            showAlertDelete={showAlertDelete}
            showDialogEdit={showDialogEdit}
          />
        </div>
      </div>
    </>
  );
}
