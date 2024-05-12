import { NextRequest, NextResponse } from 'next/server';
import { updateTaskWithModules } from '../../../services/task/task';

export async function POST(req: NextRequest, res: NextResponse) {
    const taskData = await req.json();
    const results = await updateTaskWithModules(taskData);
    return NextResponse.json({
        status: results.status,
        statusCode: results.statusCode,
        message: results.message,
    });
}