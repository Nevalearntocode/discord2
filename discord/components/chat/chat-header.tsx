import React from "react";
import { Hash, Search } from "lucide-react";
import MobileToggle from "../mobile-toggle";

type Props = {
  serverUrl: string;
  name: string;
  imageUrl?: string | null;
};

const ChatHeader = ({ name, serverUrl, imageUrl }: Props) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-[53.5px] border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverUrl={serverUrl} />
      <Hash className="w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      <p className="font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto">
        <MobileToggle search={true} serverUrl={serverUrl} />
      </div>
    </div>
  );
};

export default ChatHeader;