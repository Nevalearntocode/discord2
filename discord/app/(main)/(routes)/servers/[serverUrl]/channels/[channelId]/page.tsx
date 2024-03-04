import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverUrl: string;
    channelId: string;
  };
};

const ChannelIdPage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const channel = await db.channel.findUnique({
    where: {
      server: {
        url: params.serverUrl,
      },
      id: params.channelId,
      NOT: [
        {
          blockedMembers: {
            some: {
              profileId: profile.id,
            },
          },
        },
      ],
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      server: {
        url: params.serverUrl,
      },
    },
    include: {
      profile: true,
    },
  });

  if (!channel || !member) {
    redirect(`/`);
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverUrl={params.serverUrl}
        imageUrl={member.profile.imageUrl}
      />
      <div className="flex-1">Future messages</div>
      {/* socket io note */}
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          serverUrl: params.serverUrl,
          channelId: params.channelId,
        }}
      />
    </div>
  );
};

export default ChannelIdPage;
