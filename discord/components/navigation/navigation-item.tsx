"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  slug: string;
  imageUrl: string;
  name: string;
};

const NavigationItem = ({ slug, imageUrl, name }: Props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${slug}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      {/* relative position (parent in navigation sidebar) */}
      <button onClick={onClick} className="group flex items-center relative">
        <div
          className={cn(
            // flexible styles depend on server slug
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverSlug !== slug && "group-hover:h-[20px]",
            params?.serverSlug === slug ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative grop flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverSlug === slug &&
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
