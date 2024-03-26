import { db } from "@/lib/db";
import { userWithProfile } from "@/lib/user-with-profile";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const user = await userWithProfile();
    const { name, image, hashtag } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required.", { status: 400 });
    }
    if (!hashtag) {
      return new NextResponse("Hashtag is required.", { status: 400 });
    }

    const existingProfileWithHashTag = await db.profile.findUnique({
      where: {
        hashtag,
      },
    });

    if (
      existingProfileWithHashTag &&
      existingProfileWithHashTag.id !== user.profile?.id
    ) {
      return new NextResponse("Hashtag already taken.", { status: 409 });
    }

    const newUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        image,
        profile: {
          update: {
            where: {
              userId: user.id,
            },
            data: {
              name,
              imageUrl: image,
              hashtag,
            },
          },
        },
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log("[USER_SETTINGS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
