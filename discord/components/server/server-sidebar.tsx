import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, Permission } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import {
  Eye,
  Hash,
  KeyRound,
  Mic,
  ShieldBan,
  ShieldCheck,
  User2,
  Video,
} from "lucide-react";

type Props = {
  serverUrl: string;
};

const iconType = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VOICE]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  owner: <KeyRound className="h-4 w-4 mr-2 text-yellow-500" />,
  FULLACCESS: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  ACCESS: <User2 className="h-4 w-4 mr-2" />,
  READONLY: <Eye className="h-4 w-4 mr-2" />,
  BLOCKED: <ShieldBan className="h-4 w-4 mr-2" />,
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
          roles: true,
        },
      },
      roles: true,
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

  const icon = roles.find((role) => role.name === "owner")
    ? roleIconMap["owner"]
    : roles.find((role) => role.permission === Permission.FULLACCESS)
    ? roleIconMap["FULLACCESS"]
    : roles.find((role) => role.permission === Permission.ACCESS)
    ? roleIconMap["ACCESS"]
    : roles.find((role) => role.permission === Permission.READONLY)
    ? roleIconMap["BLOCKED"]
    : roleIconMap["READONLY"];

  return (
    <div className="flex flex-col h-full text-primary w-full  dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} roles={roles} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconType[channel.type],
                })),
              },
              {
                label: "Voice channels",
                type: "channel",
                data: voiceChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconType[channel.type],
                })),
              },
              {
                label: "Video channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconType[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: server.members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon,
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
