import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import FriendSearch from "./friend-search";
import { Separator } from "../ui/separator";
import UserButton from "../user-button";
import { ModeToggle } from "../mode-toggle";
import FriendRequest from "./friend-request";
import { Profile } from "@prisma/client";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import SidebarHeader from "./sidebar-header";

type Props = {
  profile: Profile;
};

const DMSidebar = async ({ profile }: Props) => {
  const requests = await db.friendRequest.findMany({
    where: {
      profileTwoId: profile.id,
    },
    include: {
      profileOne: true,
    },
  });

  const conversations = await db.conversation.findMany({
    where: {
      OR: [
        {
          profileOneId: profile.id,
        },
        {
          profileTwoId: profile.id,
        },
      ],
    },
    include: {
      profileOne: true,
      profileTwo: true,
    },
  });

  let friendProfiles: Profile[] = [];

  conversations.map((conversation) =>
    conversation.profileOneId !== profile.id
      ? friendProfiles.push(conversation.profileOne)
      : friendProfiles.push(conversation.profileTwo)
  );

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2 h-11">
          <FriendSearch />
        </div>
        <Separator className="h-[1px]" />
        {requests.length !== 0 && <FriendRequest requests={requests} />}
        <div className="flex px-2 my-4">
          <div className="flex w-full justify-center items-center text-sm group">
            <p className="text-left font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
              Direct message
            </p>
            <button className="ml-auto">
              <Plus className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition h-4 w-4" />
            </button>
          </div>
        </div>
        {friendProfiles.map((profile) => (
          <SidebarHeader
            key={profile.id}
            name={profile.name}
            imageUrl={profile.imageUrl}
            profileId={profile.id}
          />
        ))}
      </ScrollArea>
      <div className="p-4 pb-7 mt-auto flex items-center justify-between">
        <UserButton profile={profile} />
        <ModeToggle />
      </div>
    </div>
  );
};

export default DMSidebar;
