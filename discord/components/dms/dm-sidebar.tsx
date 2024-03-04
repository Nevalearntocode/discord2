import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import FriendSearch from "./friend-search";
import { Separator } from "../ui/separator";
import UserButton from "../user-button";
import { ModeToggle } from "../mode-toggle";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

type Props = {};

const DMSidebar = async (props: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  return (
    <div className="flex flex-col h-full text-primary w-full  dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2 h-11">
          <FriendSearch />
        </div>
        <Separator />
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center px-2 justify-between">
        <UserButton profile={profile} />
        <ModeToggle />
      </div>
    </div>
  );
};

export default DMSidebar;
