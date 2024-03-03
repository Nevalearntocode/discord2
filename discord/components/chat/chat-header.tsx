import React from "react";
import { Hash, Menu } from "lucide-react";

type Props = {
  serverUrl: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string | null;
};

const ChatHeader = ({ name, serverUrl, type, imageUrl }: Props) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-[53.5px] border-neutral-200 dark:border-neutral-800 border-b-2">
      <Menu className="block md:hidden" />
      {type === "channel" && (
        <Hash className="w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ChatHeader;
