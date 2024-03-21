import { RegistersUsers } from "@/services/auth/services";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    const response = await req.json();
    const results = await RegistersUsers("users", response);
    return NextResponse.json({
        status: results.status,
        statusCode: results.statusCode,
        message: results.message
    });
}