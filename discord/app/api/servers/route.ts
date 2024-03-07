import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { name, image } = await req.json();

    if (!name) {
      return new NextResponse("Missing server name", { status: 400 });
    }

    if (!image) {
      return new NextResponse("Missing server email", { status: 400 });
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

    const server = await db.server.create({
      data: {
        ownerId: profile.id,
        name,
        inviteCode: uuidv4(),
        slug,
        imageUrl: image,
        channels: {
          create: [
            {
              name: "general",
            },
            {
              name: "general",
              type: "VOICE",
            },
          ],
        },
        roles: {
          create: [
            {
              name: "owner",
              administrator: true,
            },
            {
              name: "member",
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              nickname: profile.name,
            },
          ],
        },
      },
      include: {
        channels: true,
        members: true,
        roles: true,
      },
    });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    const role = server.roles.find((role) => role.name === "owner");

    if (!member) {
      return new NextResponse("Member doesn't exist", { status: 500 });
    }

    if (!role) {
      return new NextResponse("Role doesn't exist", { status: 500 });
    }

    await db.server.update({
      where: {
        id: server.id,
        ownerId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: member.id,
            },
            data: {
              channels: {
                connect: server.channels,
              },
              roles: {
                connect: role,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVERS_POST", error);
    return new NextResponse("INTERNAL ERROR [/API/SERVERS]", { status: 500 });
  }
}
