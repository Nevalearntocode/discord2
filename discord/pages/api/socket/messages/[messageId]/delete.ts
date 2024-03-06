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
    const { serverUrl, channelId, messageId } = req.query;
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverUrl) {
      return res.status(400).json({ error: "Server url missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel id missing" });
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
        members: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
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
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profileId
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isOwner = message.memberId === member.id;
    const isAuthorized = member.roles.find(
      (role) => role.permission === "FULLACCESS"
    );

    const editable = isOwner || isAuthorized;

    if (!editable) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "PATCH") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_DELETE]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
