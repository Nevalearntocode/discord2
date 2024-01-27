import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: { message: "Email is required" } },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: { message: "Password is required" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: { message: "Confirmation email has been sent!" },
    });
  } catch (error) {
    console.log("LOGIN_ERROR", error);
    return NextResponse.json({ error: "INTERNAL ERROR" }, { status: 500 });
  }
}
