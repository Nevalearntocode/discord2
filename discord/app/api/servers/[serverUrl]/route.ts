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

    if (!params.serverUrl) {
      return new NextResponse("Server url missing", { status: 400 });
    }

    const { name, image, serverId } = await req.json();

    if (!name) {
      return new NextResponse("Server name missing.");
    }

    if (!image) {
      return new NextResponse("Server image missing.");
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
      return new NextResponse("You are not permitted to perform this action", {
        status: 401,
      });
    }

    let url = name.split(" ").join("-");

    const existingUrl = await db.server.findFirst({
      where: {
        url,
      },
    });

    if (existingUrl) {
      url = uuidv4();
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        name,
        imageUrl: image,
        url,
        inviteCode: url,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverUrl: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverUrl) {
      return new NextResponse("Server url missing", { status: 400 });
    }

    const rolePermission = await db.role.findFirst({
      where: {
        server: {
          url: params.serverUrl,
        },
        name: "owner",
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (!rolePermission) {
      return new NextResponse(
        "You don't have permission to perform this action"
      );
    }

    const server = await db.server.delete({
      where: {
        url: params.serverUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
