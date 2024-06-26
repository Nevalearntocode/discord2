"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { Role } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

type Props = {
  server: ServerWithMembersWithProfile;
  roles: Role[];
};

const ServerHeader = ({ roles, server }: Props) => {
  const { onOpen } = useModal();

  const isOwner = roles.find((role) => role.name === "owner") ? true : false;

  const isAdmin = roles.find((role) => role.administrator)
    ? true
    : false || isOwner;

  const canInvite = roles.find((role) => role.createInvite === true)
    ? true
    : false || isOwner || isAdmin;

  const canEditServer = roles.find((role) => role.manageServer)
    ? true
    : false || isOwner || isAdmin;

  const canManageMember = roles.find(
    (role) => role.manageRoles && role.kickMember
  )
    ? true
    : false || isOwner || isAdmin;

  const canManageChannel = roles.find((role) => role.manageChannels)
    ? true
    : false || isOwner || isAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button className="w-full font-semibold px-3 flex items-center h-[53.5px] border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="lg:block hidden h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {/* recap_4 */}
        {canInvite && (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("invite", { server })}
          >
            Invite code
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {canEditServer && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("editServer", { server })}
          >
            Server settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {canManageMember && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("members", { server, isOwner, isAdmin })}
          >
            Manage members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {canManageChannel && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("createChannel", { server })}
          >
            Create channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {(canManageChannel ||
          canEditServer ||
          canInvite ||
          canManageMember) && <DropdownMenuSeparator />}
        {isOwner && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("deleteServer", { server })}
          >
            Delete server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isOwner && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("leaveServer", { server })}
          >
            Leave server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
