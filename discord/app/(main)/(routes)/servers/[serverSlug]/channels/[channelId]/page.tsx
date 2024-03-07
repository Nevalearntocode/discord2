import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverSlug: string;
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
        slug: params.serverSlug,
      },
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      server: {
        slug: params.serverSlug,
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
        serverSlug={params.serverSlug}
        imageUrl={member.profile.imageUrl}
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            apiUrl="/api/messages"
            chatId={params.channelId}
            member={member}
            name={channel.name}
            paramKey="channelId"
            paramValue={params.channelId}
            socketQuery={{
              channelId: params.channelId,
              serverSlug: params.serverSlug,
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
              serverSlug: params.serverSlug,
              channelId: params.channelId,
            }}
            profileId={profile.id}
          />
        </>
      )}
      {channel.type === ChannelType.VOICE && (
        <MediaRoom
          profile={profile}
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          profile={profile}
          chatId={channel.id}
          video={true}
          audio={false}
        />
      )}
    </div>
  );
};

export default ChannelIdPage;
