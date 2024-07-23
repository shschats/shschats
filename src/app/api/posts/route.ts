import { dbConnect } from "@/app/lib/DBConnect";
import { ChatsModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset")

    //if query param is not null, use the provided param, else default to 3 (offset defaults to 0)
    const limit = limitParam !== null ? parseInt(limitParam) || 3 : 3;
    const offset = offsetParam !== null ? parseInt(offsetParam) || 0 : 0;

    const data = await ChatsModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
    return new NextResponse(JSON.stringify(data))
}