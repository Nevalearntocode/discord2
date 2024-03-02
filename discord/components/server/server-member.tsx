"use client";

import { cn } from "@/lib/utils";
import { ServerWithMembersWithProfile } from "@/types";
import { Member, Permission, Profile, Role } from "@prisma/client";
import { Eye, KeyRound, ShieldBan, ShieldCheck, User2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { UserAvatar } from "../avatar";

type Props = {
  member: Member & {
    profile: Profile;
  };
  roles: Role[];
  server: ServerWithMembersWithProfile;
};

const roleIconMap = {
  owner: <KeyRound className="h-4 w-4 mr-2 text-yellow-500" />,
  FULLACCESS: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  ACCESS: <User2 className="h-4 w-4 mr-2" />,
  READONLY: <Eye className="h-4 w-4 mr-2" />,
  BLOCKED: <ShieldBan className="h-4 w-4 mr-2" />,
};

const ServerMember = ({ member, roles, server }: Props) => {
  const params = useParams();
  const router = useRouter();

  const icon = roles.find((role) => role.name === "owner")
    ? roleIconMap["owner"]
    : roles.find((role) => role.permission === Permission.FULLACCESS)
    ? roleIconMap["FULLACCESS"]
    : roles.find((role) => role.permission === Permission.ACCESS)
    ? roleIconMap["ACCESS"]
    : roles.find((role) => role.permission === Permission.READONLY)
    ? roleIconMap["BLOCKED"]
    : roleIconMap["READONLY"];

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        imageUrl={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
