import { getAccess } from "@/lib/access";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getFullAccess } from "@/lib/full-access";
import { getReadOnly } from "@/lib/readonly";
import { NextResponse } from "next/server";

export async function POST(
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
    const fullAccessMembers = await getFullAccess(params.serverUrl);
    const AccessMembers = await getAccess(params.serverUrl);
    const readOnlyMembers = await getReadOnly(params.serverUrl);

    console.log(
      "fullaccess: ",
      fullAccessMembers,
      "Access: ",
      AccessMembers,
      "read only: ",
      readOnlyMembers
    );

    const { name, type } = await req.json();

    if (!name) {
      return new NextResponse("Server name missing.");
    }

    if (!type) {
      return new NextResponse("Server type missing.");
    }

    const rolePermission = await db.role.findFirst({
      where: {
        server: {
          url: params.serverUrl,
        },
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
        "You don't have permission to perform this action."
      );
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        channels: {
          create: {
            name,
            type,
            fullAccessMembers: {
              connect: fullAccessMembers,
            },
            readOnlyMembers: {
              connect: readOnlyMembers,
            },
            members: {
              connect: AccessMembers,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_CHANNE_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
