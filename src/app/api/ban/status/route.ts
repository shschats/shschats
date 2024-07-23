import { dbConnect } from "@/app/lib/DBConnect";
import { BannedUsersModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const userEmail = searchParams.get("userEmail");
    const data = await BannedUsersModel.find({userEmail: userEmail})
    if(data.length > 0)
        return new NextResponse(JSON.stringify({"banned": true}))

    return new NextResponse(JSON.stringify({"banned": false}))
}