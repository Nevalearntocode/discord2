import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    const { hashtag } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const otherProfile = await db.profile.findUnique({
      where: {
        hashtag,
      },
    });

    if (!otherProfile) {
      return new NextResponse("Other profile not found.", { status: 400 });
    }

    if (profile.id === otherProfile.id) {
      return new NextResponse("You can't add friend by yourself.", {
        status: 400,
      });
    }

    const existingRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          {
            profileOneId: profile.id,
            profileTwoId: otherProfile.id,
          },
          {
            profileTwoId: profile.id,
            profileOneId: otherProfile.id,
          },
        ],
      },
    });

    if (existingRequest) {
      return new NextResponse("Friend request pending", { status: 400 });
    }

    const alreadyFriend = await db.friend.findFirst({
      where: {
        OR: [
          {
            currentId: profile.id,
            otherId: otherProfile.id,
          },
          {
            currentId: otherProfile.id,
            otherId: profile.id,
          },
        ],
      },
    });

    if (alreadyFriend) {
      return new NextResponse("You are already friend", { status: 400 });
    }

    const request = await db.friendRequest.create({
      data: {
        profileOneId: profile.id,
        profileTwoId: otherProfile.id,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.log("[FRIEND_REQUEST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
