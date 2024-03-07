"use client";

import React from "react";
import queryString from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PhoneCall, PhoneOff } from "lucide-react";
import ActionTooltip from "../action-tooltip";

type Props = {
  tooltipLabel: string;
};

const ChatVoiceButton = ({ tooltipLabel }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVoice = searchParams?.get("voice");
  const Icon = isVoice ? PhoneOff : PhoneCall;

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          voice: isVoice ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVoiceButton;
