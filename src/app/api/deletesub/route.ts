import { deleteSubTask } from "@/services/task/task";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const taskData = await req.json();
    const results = await deleteSubTask(taskData);
    return NextResponse.json({
        status: results.status,
        statusCode: results.statusCode,
        message: results.message,
    });
}