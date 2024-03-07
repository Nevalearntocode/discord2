import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverSlug: string; memberId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverSlug) {
      return new NextResponse("Server slug missing", {
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
                OR: [
                  {
                    administrator: true,
                  },
                  {
                    kickMember: true,
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

    const isAdmin = await db.role.findFirst({
      where: {
        members: {
          some: {
            id: params.memberId,
          },
        },
        OR: [
          {
            administrator: true,
          },
          {
            name: "owner",
          },
        ],
      },
    });

    if (!isAdmin) {
      const server = await db.server.update({
        where: {
          slug: params.serverSlug,
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

    if (isAdmin && !isOwner) {
      return new NextResponse(
        "You are not permitted to perform this action [OWNER NEEDED]",
        {
          status: 401,
        }
      );
    }

    const server = await db.server.update({
      where: {
        slug: params.serverSlug,
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
    console.log("SERVER_SLUG_MEMBERID", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
