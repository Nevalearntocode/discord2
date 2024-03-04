import ChatHeader from "@/components/chat/chat-header";
import ConversationHeader from "@/components/chat/conversation-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    profileId: string;
  };
};

const MemberIdPage = async ({ params }: Props) => {
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
    </div>
  );
};

export default MemberIdPage;
