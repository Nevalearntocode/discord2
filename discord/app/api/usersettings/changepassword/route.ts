import { db } from "@/lib/db";
import { userWithProfile } from "@/lib/user-with-profile";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const user = await userWithProfile();
    const { newPassword } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!newPassword) {
      return new NextResponse("Password is required.", { status: 400 });
    }

    const password = await bcrypt.hash(newPassword, 10);

    const newUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log("[CHANGE_PASSWORD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
