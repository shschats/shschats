import { dbConnect } from "@/app/lib/DBConnect";
import { BannedUsersModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json()
      await dbConnect();
  
      const saveData = new BannedUsersModel({
        userEmail: body.userEmail,
      });
      await saveData.save();
  
      return new NextResponse(JSON.stringify({"status": "success"}));
    } catch(e: any) {
      console.error('Error:', e);
      return new NextResponse(JSON.stringify({"status": "failed"}));
    }
  }