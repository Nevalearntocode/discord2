import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverUrl: string; channelId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverUrl) {
      return new NextResponse("Server url is missing", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("Channel id is missing", { status: 400 });
    }

    const { name, type } = await req.json();

    if (!name) {
      return new NextResponse("Channel name is missing", { status: 400 });
    }

    if (!type) {
      return new NextResponse("Channel type is missing", { status: 400 });
    }

    const permittedMember = await db.member.findMany({
      where: {
        server: {
          url: params.serverUrl,
        },
        fullAccessChannels: {
          some: {
            fullAccessMembers: {
              some: {
                profileId: profile.id,
              },
            },
          },
        },
      },
    });

    if (!permittedMember) {
      return new NextResponse("You are not allowed to perform this action.", {
        status: 401,
      });
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("EDIT_CHANNEL", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { serverUrl: string; channelId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverUrl) {
      return new NextResponse("Server url is missing", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("Channel id is missing", { status: 400 });
    }

    const permittedMember = await db.member.findMany({
      where: {
        server: {
          url: params.serverUrl,
        },
        fullAccessChannels: {
          some: {
            fullAccessMembers: {
              some: {
                profileId: profile.id,
              },
            },
          },
        },
      },
    });

    if (!permittedMember) {
      return new NextResponse("You are not allowed to perform this action.", {
        status: 401,
      });
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("DELETE_CHANNEL", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
