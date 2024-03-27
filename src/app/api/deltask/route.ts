
import { deleteTask } from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const userId: string = "7LgxPWq3aIMHRFWMs9rH";
        const results = await deleteTask(userId, "84317ae6-3187-4332-8349-7f730f1fc5dc");
        return NextResponse.json({
            status: results?.status,
            statusCode: results?.statusCode,
            message: results?.message
        })
    } catch (error) {

    }
}

