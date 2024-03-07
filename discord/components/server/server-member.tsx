"use client";

import { cn } from "@/lib/utils";
import { ServerWithMembersWithProfile } from "@/types";
import { Member, Profile, Role } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { UserAvatar } from "../avatar";
import ActionTooltip from "../action-tooltip";

type Props = {
  member: Member & {
    profile: Profile;
  } & {
    roles: Role[];
  };
  server: ServerWithMembersWithProfile;
};

const ServerMember = ({ member, server }: Props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/dms/${member.profileId}`);
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={onClick}
    >
      <UserAvatar
        imageUrl={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <ActionTooltip label={member.profile.name} side="left">
        <p
          className={cn(
            "line-clamp-1 text-left font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {member.profile.name}
        </p>
      </ActionTooltip>
    </button>
  );
};

export default ServerMember;
