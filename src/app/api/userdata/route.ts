import { getUserById } from "@/services/users/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";
    if (!id) return NextResponse.json({ status: 400, message: "Bad Request" }); 
    const users = await getUserById(id);
    return NextResponse.json({
        status: users.status,
        message: users.message,
        data: users.data || [],
    });
}