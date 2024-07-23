import { dbConnect } from "@/app/lib/DBConnect";
import { BannedUsersModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json()
      await dbConnect();
  
      await BannedUsersModel.deleteMany({userEmail: body.userEmail})
  
      return new NextResponse(JSON.stringify(`succesfully removed email ${body.userEmail}`));
    } catch(e: any) {
      console.error('Error:', e);
      return new NextResponse(JSON.stringify('failed'));
    }
  }