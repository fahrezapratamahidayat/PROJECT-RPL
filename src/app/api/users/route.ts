import { getUsers } from "@/services/users/getUser";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
    const users = await getUsers();
    return NextResponse.json({
      status: 200,
      message: "good Request",
      users: users,
    });
}