import ChatInput from "@/components/chat/chat-input";
import ConversationHeader from "@/components/chat/conversation-header";
import DMMessages from "@/components/dms/dm-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    profileId: string;
  };
  searchParams: {
    video?: boolean;
  };
};

const MemberIdPage = async ({ params, searchParams }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const otherProfile = await db.profile.findFirst({
    where: {
      id: params.profileId,
    },
  });

  if (!otherProfile) {
    return redirect(`/`);
  }

  const conversation = await getOrCreateConversation(
    profile.id,
    otherProfile.id
  );

  if (!conversation) {
    return redirect(`/`);
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ConversationHeader
        name={otherProfile.name}
        profileId={otherProfile.id}
        imageUrl={otherProfile.imageUrl}
      />
      {searchParams.video && (
        <MediaRoom
          audio={true}
          chatId={conversation.id}
          video={true}
          profile={profile}
        />
      )}
      {!searchParams.video && (
        <>
          <DMMessages
            apiUrl="/api/dms"
            chatId={conversation.id}
            name={otherProfile.name}
            paramKey="conversationId"
            paramValue={conversation.id}
            profile={profile}
            socketQuery={{
              conversationId: conversation.id,
            }}
            socketUrl="/api/socket/dms"
            type="conversation"
          />
          <div>
            <ChatInput
              apiUrl="/api/socket/dms"
              name={otherProfile.name}
              profileId={profile.id}
              query={{
                conversationId: conversation.id,
              }}
              type="conversation"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
