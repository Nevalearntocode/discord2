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
    const { conversationId } = req.query;

    if (!profileId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await db.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation id missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "content missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            profileOneId: profileId,
          },
          {
            profileTwoId: profileId,
          },
        ],
      },
      include: {
        profileOne: true,
        profileTwo: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    });

    const conversationKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(conversationKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
