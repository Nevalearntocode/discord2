import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import FriendSearch from "./friend-search";
import { Separator } from "../ui/separator";
import UserButton from "../user-button";
import { ModeToggle } from "../mode-toggle";
import FriendRequest from "./friend-request";
import { Profile } from "@prisma/client";
import { db } from "@/lib/db";

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

  const friends = await db.friend.findMany({
    where: {
      OR: [
        {
          otherId: profile.id,
        },
        {
          currentId: profile.id,
        },
      ],
    },
    include: {
      current: true,
      other: true,
    },
  });

  let friendProfiles: Profile[] = [];

  friends.map((friend) =>
    friend.currentId !== profile.id
      ? friendProfiles.push(friend.current)
      : friendProfiles.push(friend.other)
  );

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2 h-11">
          <FriendSearch />
        </div>
        <Separator className="h-[1px]" />
        {requests.length !== 0 && <FriendRequest requests={requests} />}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center px-2 justify-between">
        <UserButton profile={profile} />
        <ModeToggle />
      </div>
    </div>
  );
};

export default DMSidebar;
