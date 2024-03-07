import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverSlug: string } }
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

    const { memberId, roleId, serverId } = await req.json();

    if (!memberId) {
      return new NextResponse("member id missing", {
        status: 400,
      });
    }

    if (!roleId) {
      return new NextResponse("role id missing", {
        status: 400,
      });
    }

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

    if (rolePermission.administrator) {
      if (!isOwner) {
        return new NextResponse(
          "You are not permitted to perform this action [OWNER NEEDED]",
          {
            status: 401,
          }
        );
      }
    }

    const alreadyAssigned = await db.role.findFirst({
      where: {
        id: roleId,
        members: {
          some: {
            id: memberId,
          },
        },
        server: {
          slug: params.serverSlug,
        },
      },
    });

    if (alreadyAssigned) {
      if (alreadyAssigned.administrator) {
        const server = await db.server.update({
          where: {
            slug: params.serverSlug,
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
          slug: params.serverSlug,
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

    if (rolePermission.administrator) {
      const server = await db.server.update({
        where: {
          slug: params.serverSlug,
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
    }

    const server = await db.server.update({
      where: {
        slug: params.serverSlug,
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
    console.log("SERVER_SLUG_MEMBER", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
