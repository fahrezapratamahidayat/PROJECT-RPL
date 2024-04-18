import { addTeams } from "@/services/teams/teams";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const requestData = await req.json();
        const result = await addTeams(requestData);

        if (result.status) {
            return NextResponse.json({
                status: result.status,
                statusCode: result.statusCode,
                message: result.message,
            });
        } else {
            return NextResponse.json({
                status: result.status,
                statusCode: result.statusCode,
                message: result.message,
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}