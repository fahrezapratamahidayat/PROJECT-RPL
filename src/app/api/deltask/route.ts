import { deleteTask } from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    const userId: string = "7LgxPWq3aIMHRFWMs9rH";
    const results = await deleteTask(userId, "60212b2e-3a76-4ef5-a3f7-dffda12def0d");
    return NextResponse.json({
        status: results.status,
        statusCode: results.statusCode,
        message: results.message
    })
}