import { dbConnect } from "@/app/lib/DBConnect";
import { ChatsModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const user = searchParams.get("user");

    const data = await ChatsModel.find({author: user})
    return new NextResponse(JSON.stringify(data))
}