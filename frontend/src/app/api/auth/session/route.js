import { NextResponse } from "next/server";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  if (token.startsWith("jwt-")) {
    try {
      const decoded = JSON.parse(Buffer.from(token.replace("jwt-", ""), "base64").toString("utf-8"));
      return NextResponse.json(decoded);
    } catch {
      return NextResponse.json({ detail: "Invalid token payload" }, { status: 401 });
    }
  }

  return NextResponse.json({ detail: "Session expired or invalid" }, { status: 401 });
}
