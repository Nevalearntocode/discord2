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
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerMember from "./server-member";

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

const MemberSidebar = async ({ serverUrl }: Props) => {
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

  const fullAccessMember = server.members.filter((member) =>
    member.roles.find((role) => role.permission === "FULLACCESS")
  );

  const accessMember = server.members.filter((member) =>
    member.roles.every((role) => role.permission !== "FULLACCESS")
  );

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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Members",
                type: "member",
                data: server.members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: member.roles.find((role) => role.name === "owner")
                    ? roleIconMap["owner"]
                    : member.roles.find(
                        (role) => role.permission === Permission.FULLACCESS
                      )
                    ? roleIconMap["FULLACCESS"]
                    : member.roles.find(
                        (role) => role.permission === Permission.ACCESS
                      )
                    ? roleIconMap["ACCESS"]
                    : member.roles.find(
                        (role) => role.permission === Permission.READONLY
                      )
                    ? roleIconMap["BLOCKED"]
                    : roleIconMap["READONLY"],
                })),
              },
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
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!fullAccessMember?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="member"
              roles={roles}
              label="Admin"
              server={server}
            />
            {fullAccessMember.map((member) => (
              <ServerMember member={member} key={member.id} server={server} />
            ))}
          </div>
        )}
        {!!accessMember?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            <ServerSection
              sectionType="member"
              roles={roles}
              label="Member"
              server={server}
            />
            {accessMember.map((member) => (
              <ServerMember member={member} key={member.id} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MemberSidebar;
