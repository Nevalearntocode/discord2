import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverUrl: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { state, serverId, isPublic, inviteCode } = await req.json();
    if (!params.serverUrl) {
      return new NextResponse("Server url missing", { status: 400 });
    }

    const rolePermission = await db.role.findFirst({
      where: {
        serverId,
        members: {
          some: {
            profileId: profile.id,
            roles: {
              some: {
                permission: "FULLACCESS",
              },
            },
          },
        },
      },
    });

    if (!rolePermission) {
      return new NextResponse(
        "You do not have permission to perform this action",
        { status: 401 }
      );
    }

    if (state === "reset") {
      const server = await db.server.update({
        where: {
          url: params.serverUrl,
        },
        data: {
          inviteCode: uuidv4(),
        },
      });
      return NextResponse.json(server);
    }

    if (isPublic) {
      const server = await db.server.update({
        where: {
          url: params.serverUrl,
        },
        data: {
          public: !isPublic,
          inviteCode: uuidv4(),
        },
      });
      return NextResponse.json(server);
    } else {
      const server = await db.server.update({
        where: {
          url: params.serverUrl,
        },
        data: {
          public: true,
          inviteCode: inviteCode,
        },
      });
      return NextResponse.json(server);
    }
  } catch (error) {
    console.log("[INVITE_CODE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
