import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN!,
  "Access-Control-Allow-Methods": process.env.ACCESS_CONTROL_ALLOW_METHODS!,
  "Access-Control-Allow-Headers": process.env.ACCESS_CONTROL_ALLOW_HEADERS!,
};

export async function middleware(req: NextRequest) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: corsHeaders });
  }

  // Handle CORS for other requests
  const requestOrigin = req.headers.get("origin");
  if (
    requestOrigin &&
    requestOrigin !== corsHeaders["Access-Control-Allow-Origin"]
  ) {
    return new NextResponse("CORS origin not allowed", { status: 403 });
  }

  if (req.nextUrl.pathname.startsWith("/chats")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", req.url));
  }
  
  return NextResponse.next();
}
