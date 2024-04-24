import { Checkbox } from "@radix-ui/react-checkbox";
import { Calendar, EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Children } from "react";
import { ComboboxDropdownMenu } from "../dropdown/comboxDropdown";
import Link from "next/link";

export default function ListTasks({
  link,
  title,
  deadline,
  created_At,
  showAlertDelete,
  showDialogEdit,
}: {
  title: string;
  description: string;
  deadline: string;
  created_At: string;
  showAlertDelete: () => void;
  showDialogEdit: () => void;
  link: string;
}) {
  return (
    <>
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-stretch">
            <div className="flex flex-col lg:ml-4">
              <Link href={`/schedule/${link}`}>
                <h2 className="text-base font-semibold">{title}</h2>
              </Link>
              <div className="flex items-start lg:items-center mt-1 gap-1.5">
                <Calendar className="text-muted-foreground w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {created_At} - {deadline}
                </span>
              </div>
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
