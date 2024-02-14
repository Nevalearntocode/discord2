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

    let url = name.split(" ").join("-");

    const existingUrl = await db.server.findFirst({
      where: {
        url,
      },
    });

    if (existingUrl) {
      url = uuidv4();
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        inviteCode: uuidv4(),
        url,
        imageUrl: image,
        channels: {
          create: [
            {
              name: "general",
            },
          ],
        },
        roles: {
          create: [
            {
              name: "owner",
              permission: "FULLACCESS",
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
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
    const channel = server.channels.find(
      (channel) => channel.name === "general"
    );
    const role = server.roles.find((role) => role.name === "owner");

    if (!channel) {
      return new NextResponse("Channel doesn't exist", { status: 500 });
    }

    if (!member) {
      return new NextResponse("Member doesn't exist", { status: 500 });
    }

    if (!role) {
      return new NextResponse("Role doesn't exist", { status: 500 });
    }

    await db.server.update({
      where: {
        id: server.id,
        profileId: profile.id,
      },
      data: {
        channels: {
          update: {
            where: {
              id: channel.id,
            },
            data: {
              fullAccessMembers: {
                connect: member,
              },
            },
          },
        },
        roles: {
          update: {
            where: {
              id: role.id,
            },
            data: {
              members: {
                connect: member,
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
