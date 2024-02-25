import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
      return new NextResponse("Server url missing", {
        status: 400,
      });
    }

    const { memberId, roleId, serverId } = await req.json();

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

    const rolePermission = await db.role.findFirst({
      where: {
        id: roleId,
      },
    });

    if (!rolePermission) {
      return new NextResponse("Role id doesn't exist", { status: 400 });
    }

    if (rolePermission.permission === "FULLACCESS" && !isOwner) {
      return new NextResponse(
        "You are not permitted to perform this action [OWNER NEEDED]",
        {
          status: 401,
        }
      );
    }

    const alreadyAssigned = await db.member.findFirst({
      where: {
        id: memberId,
        roles: {
          some: {
            id: roleId,
          },
        },
      },
    });

    if (alreadyAssigned) {
      const server = await db.server.update({
        where: {
          url: params.serverUrl,
        },
        data: {
          members: {
            update: {
              where: {
                id: memberId,
              },
              data: {
                roles: {
                  disconnect: {
                    id: roleId,
                  },
                },
              },
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

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              roles: {
                connect: {
                  id: roleId,
                },
              },
            },
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
    console.log("SERVER_URL_MEMBER", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}