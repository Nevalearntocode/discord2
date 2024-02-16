import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
      return new NextResponse("Server url missing", { status: 400 });
    }

    const { name, image, isPermitted } = await req.json();

    if (!isPermitted) {
      return new NextResponse("You are not permitted to perform this action", {
        status: 401,
      });
    }

    let url = name.split(" ").join("-");

    const existingUrl = await db.server.findFirst({
      where: {
        url,
      },
    });

    if (existingUrl) {
      url = uuidv4();
    }

    const server = await db.server.update({
      where: {
        url: params.serverUrl,
      },
      data: {
        name,
        imageUrl: image,
        url,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
