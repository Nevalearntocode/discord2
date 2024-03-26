"use client";

import React from "react";
import { UserAvatar } from "../avatar";
import { useRouter } from "next/navigation";
import { useSocket } from "../providers/socket-provider";

type Props = {
  name: string;
  imageUrl: string | null;
  profileId: string;
};

const SidebarHeader = ({ name, imageUrl, profileId }: Props) => {
  const router = useRouter();

  return (
    <button
      className="group font-semibold px-3 flex items-center justify-start h-[53.5px] border-neutral-200 dark:border-neutral-800 relative"
      onClick={() => router.push(`/dms/${profileId}`)}
    >
      <UserAvatar imageUrl={imageUrl} className="mr-2 h-8 w-8" />
      <p className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition mr-4">
        {name}
      </p>
    </button>
  );
};

export default SidebarHeader;
