import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";

type Props = {
  serverUrl: string;
};

const ServerSidebar = async ({ serverUrl }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      url: serverUrl,
      OR: [
        {
          public: true,
        },
        {
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
      ],
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!server) {
    return redirect(`/`);
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const voiceChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VOICE
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // const members = server?.members.filter((member) => member.profileId !== profile.id)

  const roles = await db.role.findMany({
    where: {
      serverId: server.id,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="flex flex-col h-full text-primary w-full  dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} roles={roles} />
    </div>
  );
};

export default ServerSidebar;
