import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: { message: "Email is required" } },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: { message: "Name is required" } },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: { message: "Password is required" } },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            message: "Email already exists",
          },
        },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await db.profile.create({
      data: {
        email,
        name,
        userId: user.id,
      },
    });

    // Todo: send verification email

    return NextResponse.json({
      success: {
        email,
        name,
        message: "Account created",
      },
    });
  } catch (error) {
    console.log("REGISTER_ERROR", error);
    return NextResponse.json({ error: "INTERNAL ERROR" }, { status: 500 });
  }
}
