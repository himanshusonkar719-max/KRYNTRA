import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required." },
        { status: 400 }
      );
    }

    const userName = name || email.split("@")[0] || "Security Analyst";
    const user = {
      id: "usr-" + Date.now(),
      name: userName,
      email: email.toLowerCase(),
      role: "analyst",
      created_at: new Date().toISOString(),
    };

    const token = "jwt-" + Buffer.from(JSON.stringify(user)).toString("base64");

    return NextResponse.json({
      access_token: token,
      token_type: "bearer",
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { detail: "Failed to process registration request." },
      { status: 500 }
    );
  }
}
