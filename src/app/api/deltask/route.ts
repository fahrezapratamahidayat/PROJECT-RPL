import { deleteTaskById } from "@/services/task/task";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    const response = await req.json();
    const results = await deleteTaskById(response.id);
    return NextResponse.json({
        status: results.status,
        statusCode: results.statusCode,
        message: results.message
    })
}