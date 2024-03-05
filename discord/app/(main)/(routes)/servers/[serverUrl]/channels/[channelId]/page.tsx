import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
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
      roles: true,
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
      <ChatMessages
        apiUrl="/api/messages"
        chatId={params.channelId}
        member={member}
        name={channel.name}
        paramKey="channelId"
        paramValue={params.channelId}
        socketQuery={{
          channelId: params.channelId,
          serverUrl: params.serverUrl,
        }}
        socketUrl="/api/socket/messages"
        type="channel"
      />
      {/* socket io note */}
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          serverUrl: params.serverUrl,
          channelId: params.channelId,
        }}
        profileId={profile.id}
      />
    </div>
  );
};

export default ChannelIdPage;
