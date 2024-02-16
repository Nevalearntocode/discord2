import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
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

    const { name, permission, isPermitted } = await req.json();

    if (!isPermitted) {
      return new NextResponse("You are not permitted to perform this action", {
        status: 401,
      });
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
