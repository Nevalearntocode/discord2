import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
      return new NextResponse("Server slug missing", { status: 400 });
    }

    const { name, image } = await req.json();

    if (!name) {
      return new NextResponse("Server name missing.");
    }

    if (!image) {
      return new NextResponse("Server image missing.");
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
                  {
                    administrator: true,
                  },
                  {
                    manageServer: true,
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

    let slug = name.split(" ").join("-");

    const existingSlug = await db.server.findFirst({
      where: {
        slug,
      },
    });

    if (existingSlug) {
      slug = uuidv4();
    }

    const server = await db.server.update({
      where: {
        slug: params.serverSlug,
      },
      data: {
        name,
        imageUrl: image,
        slug,
        inviteCode: slug,
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
  { params }: { params: { serverSlug: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverSlug) {
      return new NextResponse("Server url missing", { status: 400 });
    }

    const rolePermission = await db.role.findFirst({
      where: {
        server: {
          slug: params.serverSlug,
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
        slug: params.serverSlug,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
