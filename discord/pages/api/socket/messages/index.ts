"use server";

import { currentProfilePages } from "@/lib/current-profile-page";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allow" });
  }
  try {
    // const profile = await currentProfilePages(req, res)

    const { content, profileId, fileUrl } = req.body;
    const { serverUrl, channelId } = req.query;

    if (!profileId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverUrl) {
      return res.status(400).json({ error: "Server url missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel id missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "content missing" });
    }

    const server = await db.server.findFirst({
      where: {
        url: serverUrl as string,
        members: {
          some: {
            profileId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        server: {
          url: serverUrl as string,
        },
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profileId
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
