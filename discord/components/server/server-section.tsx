"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, Role } from "@prisma/client";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

type Props = {
  label: string;
  roles?: Role[];
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfile;
};

const ServerSection = ({
  label,
  sectionType,
  channelType,
  roles,
  server,
}: Props) => {
  const { onOpen } = useModal();
  // console.log(server);

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {roles?.find((role) => role.permission === "FULLACCESS") &&
        sectionType === "channel" && (
          <ActionTooltip label="Create channel" side="top">
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={() => onOpen("createChannel", { server, channelType })}
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
      {roles?.find((role) => role.permission === "FULLACCESS") &&
        sectionType === "member" && (
          <ActionTooltip label="Manage members" side="top">
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={() => onOpen("members", { server })}
            >
              <Settings className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
    </div>
  );
};

export default ServerSection;
