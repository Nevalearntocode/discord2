"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  url: string;
  imageUrl: string;
  name: string;
};

const NavigationItem = ({ url, imageUrl, name }: Props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${url}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      {/* relative position (parent in navigation sidebar) */}
      <button onClick={onClick} className="group flex items-center relative">
        <div
          className={cn(
            // flexible styles depend on server url
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverUrl !== url && "group-hover:h-[20px]",
            params?.serverUrl === url ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative grop flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverUrl === url &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageUrl} fill alt="server" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
