import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { NextResponse } from "next/server";
import { AuthError } from "next-auth";

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

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { error: { message: "User does not exists or wrong password." } },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { error: "INTERNAL ERROR" },
            { status: 500 }
          );
      }
    }
    console.log("LOGIN_ERROR", error);
    throw error;
  }
}
