import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allow" });
  }
  try {
    const { directMessageId, conversationId } = req.query;
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await db.profile.findUnique({
      where: {
        id: profileId,
      },
    });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        profile: true,
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isOwner = message.profileId === profile.id;

    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          profile: true,
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGE_DELETE]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
