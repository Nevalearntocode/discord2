import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const profile = await currentProfile();

    const requestId = params.requestId;

    if (!profile) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const request = await db.friendRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        profileOne: true,
        profileTwo: true,
      },
    });

    if (!request) {
      return new NextResponse("Friend request not found", { status: 404 });
    }

    const friend = await db.friend.create({
      data: {
        currentId: profile.id,
        otherId: request.profileTwoId,
      },
    });

    await db.friend.update({
      where: {
        id: friend.id,
      },
      data: {
        current: {
          connect: request.profileTwo,
        },
        other: {
          connect: request.profileOne,
        },
      },
    });

    await db.friendRequest.delete({
      where: {
        id: request.id,
      },
    });

    return NextResponse.json(friend);
  } catch (error) {
    console.log("[ADD_FRIEND]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const profile = await currentProfile();

    const requestId = params.requestId;

    if (!profile) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const request = await db.friendRequest.delete({
      where: {
        id: requestId,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.log("[REJECT_REQUEST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
