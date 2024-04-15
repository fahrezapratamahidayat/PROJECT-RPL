import { filterTasksByType } from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";
  const type = searchParams.get("type") || "";
  if (!id) return NextResponse.json({ status: 400, message: "Bad Request" });
  const filterTasks = await filterTasksByType(id, type);

  return NextResponse.json({
    status: filterTasks.status,
    message: filterTasks.message,
    tasks: filterTasks.tasks
  })
}