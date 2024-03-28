import { Checkbox } from "@radix-ui/react-checkbox";
import { Calendar, EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";

export default function ListTasks({
  taskName,
  deadline,
  created_At,
  onClick
}: {
  taskName: string;
  description: string;
  deadline: string;
  created_At: string;
  onClick : () => void
}) {
  return (
    <>
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-stretch">
            <div className="flex flex-col ml-4">
              <h2 className="text-sm font-semibold">{taskName}</h2>
              <div className="flex items-center mt-1 gap-1.5">
                <Calendar className="text-muted-foreground w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {created_At} - {deadline}
                </span>
              </div>
            </div>
          </div>
          <Button
            className="px-2"
            variant={"ghost"}
            onClick={onClick}
          >
            <EllipsisVertical />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </div>
    </>
  );
}
