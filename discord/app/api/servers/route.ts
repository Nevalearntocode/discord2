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
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        roles: {
          create: [
            { name: "owner", permission: "FULLACCESS", profileId: profile.id },
          ],
        },
        members: {
          create: [{ profileId: profile.id }],
        },
      },
    });

    // const member = await db.member.findFirst({
    //   where: {
    //     serverId: server.id,
    //     profileId: profile.id,
    //   },
    // });

    // const channel = await db.channel.findFirst({
    //   where: {
    //     serverId: server.id,
    //     name: "general"
    //   }
    // })

    // await db.server.update({
    //   where: {
    //     id: server.id
    //   },
    //   data: {
    //     channels: {
    //       update: {
    //         where: {
    //           id: channel!.id
    //         }
    //       }
    //     }
    //   }
    // })

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVERS_POST", error);
    return new NextResponse("INTERNAL ERROR [/API/SERVERS]", { status: 500 });
  }
}
