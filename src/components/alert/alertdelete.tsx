"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alertDialog";
import { Button } from "../ui/button";

export default function AlertDeleteTask({
  isOpen,
  setIsOpen,
  data,
  onClickDelete,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: any;
  onClickDelete: () => void;
}) {
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas</AlertDialogTitle>
            <AlertDialogDescription>
              Tugas berikut{" "}
              <span className="font-bold text-red-500">{data.title}</span> akan
              dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onClickDelete}>
              Lanjut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
