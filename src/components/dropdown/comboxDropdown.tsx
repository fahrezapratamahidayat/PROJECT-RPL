"use client";

import * as React from "react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ComboboxDropdownMenu({
  showDialogEdit,
  showAlertDelete,
}: {
  showDialogEdit: () => void;
  showAlertDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuGroup>
          <DropdownMenuItem className="" onClick={showDialogEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={showAlertDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
