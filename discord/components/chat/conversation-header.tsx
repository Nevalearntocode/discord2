import React from "react";
import { Hash, Search } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import { UserAvatar } from "../avatar";
import ConvMobileToggle from "../conv-mobile-toggle";
import SocketIndicator from "../socket-indicator";
import ChatVideoButton from "../dms/chat-video-button";
import ChatVoiceButton from "../dms/chat-voice-button";

type Props = {
  profileId: string;
  name: string;
  imageUrl: string | null;
};

const ConversationHeader = ({ name, profileId, imageUrl }: Props) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-[53.5px] border-neutral-200 dark:border-neutral-800 border-b-2">
      <ConvMobileToggle />
      <UserAvatar imageUrl={imageUrl} className="mr-2 h-8 w-8" />
      <p className="font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center justify-center">
        <ChatVoiceButton tooltipLabel="Voice call" />
        <ChatVideoButton tooltipLabel="Video call" />
        <SocketIndicator />
        {/* <MobileToggle search={true} serverUrl={serverUrl} /> */}
      </div>
    </div>
  );
};

export default ConversationHeader;
