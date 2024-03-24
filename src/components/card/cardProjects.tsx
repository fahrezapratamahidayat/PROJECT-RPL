"use client";

import { CalendarFold } from "lucide-react";
import { Progress } from "../ui/progress";

export default function CardProjects() {
  return (
    <>
      <div className="border rounded-lg shadow-lg p-4">
        <h1 className="text-base font-bold">UI/UX Design</h1>
        <p className="text-sm text-muted-foreground text-justify mt-2 w-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab atque
          rerum, aspernatur voluptates corporis beatae vero modi
        </p>
        <div className="space-y-2.5 mt-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm">Progress</h2>
            <p className="text-sm text-muted-foreground">50%</p>
          </div>
          <Progress value={20} />
        </div>
        <div className="space-y-2.5 mt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarFold className="h-4 w-4" />
            <h2 className="text-sm font-semibold">24 es 2024</h2>
          </div>
        </div>
      </div>
    </>
  );
}
