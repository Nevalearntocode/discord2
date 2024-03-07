import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { serverSlug: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverSlug) {
      return new NextResponse("Server slug missing", { status: 400 });
    }
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
          slug: params.serverSlug,
        },
        members: {
          some: {
            profileId: profile.id,
            roles: {
              some: {
                OR: [
                  { administrator: true },
                  { manageChannels: true },
                  { name: "owner" },
                ],
              },
            },
          },
        },
      },
    });

    const members = await db.member.findMany({
      where: {
        server: {
          slug: params.serverSlug,
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
        slug: params.serverSlug,
      },
      data: {
        channels: {
          create: {
            name,
            type,
            members: {
              connect: members,
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
