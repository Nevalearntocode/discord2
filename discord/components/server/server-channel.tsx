"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, Role, Server } from "@prisma/client";
import { Edit, Hash, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

type Props = {
  channel: Channel;
  server: Server;
  roles?: Role[];
};

const iconType = {
  [ChannelType.TEXT]: (
    <Hash className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VOICE]: (
    <Mic className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
  ),
};

const ServerChannel = ({ channel, server, roles }: Props) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${server.url}/channels/${channel.id}`);
  };

  // recap_11, important!
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {iconType[channel.type]}
      <ActionTooltip label={channel.name} side="right">
        <p
          className={cn(
            "text-left line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.channelId === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
      </ActionTooltip>
      {roles?.find((role) => role.permission === "FULLACCESS") && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition h-4 w-4"
              onClick={(e) => onAction(e, "editChannel")}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition h-4 w-4"
              onClick={(e) => onAction(e, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};

export default ServerChannel;
