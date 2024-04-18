import { getTasksByUserId } from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("user") || "";
    if (!id) return NextResponse.json({ status: 400, message: "Bad Request" }); 
    const users = await getTasksByUserId(id);
    return NextResponse.json({
        status: users.status,
        message: users.message,
        tasks: users.tasks
    });
}