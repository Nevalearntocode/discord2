import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverUrl: string; memberId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverUrl) {
      return new NextResponse("Server url missing", {
        status: 400,
      });
    }

    if (!params.memberId) {
      return new NextResponse("Member id missing", {
        status: 400,
      });
    }

    const { serverId } = await req.json();

    const isPermitted = await db.role.findFirst({
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

    const isOwner = await db.role.findFirst({
      where: {
        serverId,
        members: {
          some: {
            profileId: profile.id,
            roles: {
              some: {
                name: "owner",
              },
            },
          },
        },
      },
    });

    if (!isPermitted && !isOwner) {
      return new NextResponse(
        "You are not permitted to perform this action [ADMIN NEEDED]",
        {
          status: 401,
        }
      );
    }

    const rolePermission = await db.role.findFirst({
      where: {
        permission: "FULLACCESS",
        members: {
          some: {
            id: params.memberId,
          },
        },
      },
    });

    if (!rolePermission) {
      const server = await db.server.update({
        where: {
          url: params.serverUrl,
        },
        data: {
          members: {
            delete: {
              id: params.memberId,
            },
          },
        },
        include: {
          members: {
            include: {
              profile: true,
              roles: true,
            },
          },
          roles: true,
        },
      });

      return NextResponse.json(server);
    }

    if (rolePermission.permission === "FULLACCESS" && !isOwner) {
      return new NextResponse(
        "You are not permitted to perform this action [OWNER NEEDED]",
        {
          status: 401,
        }
      );
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        members: {
          delete: {
            id: params.memberId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
            roles: true,
          },
        },
        roles: true,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_URL_MEMBERID", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
