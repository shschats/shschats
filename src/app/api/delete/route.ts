import { dbConnect } from "@/app/lib/DBConnect";
import { ChatsModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

//worded and written terrible fix later
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json()
    const id = body.id
    await ChatsModel.findByIdAndDelete(id);
      return new NextResponse(JSON.stringify('success'));
  } catch(e: any) {
    console.error('Error:', e);
    return new NextResponse(JSON.stringify('failed'));
  }
}