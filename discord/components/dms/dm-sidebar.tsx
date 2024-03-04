import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import FriendSearch from "./friend-search";
import { Separator } from "../ui/separator";

type Props = {};

const DMSidebar = (props: Props) => {
  return (
    <div className="flex flex-col h-full text-primary w-full  dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2 h-11">
          <FriendSearch />
        </div>
        <Separator />
      </ScrollArea>
    </div>
  );
};

export default DMSidebar;