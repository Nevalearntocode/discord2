import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Permission } from "@prisma/client";
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

    const { name, permission, serverId } = await req.json();

    const rolePermission = await db.role.findFirst({
      where: {
        serverId,
        members: {
          some: {
            profileId: profile.id,
            roles: {
              some: {
                OR: [
                  {
                    permission: "FULLACCESS",
                  },
                  {
                    name: "owner",
                  },
                ],
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

    if (permission === Permission.FULLACCESS) {
      const role = await db.role.findFirst({
        where: {
          serverId: serverId,
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

      if (!role) {
        return new NextResponse(
          "You are not permitted to perform this action",
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
          roles: {
            create: {
              name,
              permission,
            },
          },
        },
      });

      return NextResponse.json(server);
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        roles: {
          create: {
            name,
            permission,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_URL_ROLE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
