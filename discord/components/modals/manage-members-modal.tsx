"use client";

import { useState } from "react";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServerWithMembersWithProfile } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Role } from "@prisma/client";
import { UserAvatar } from "@/components/avatar";
import {
  Check,
  Eye,
  KeyRound,
  Loader2,
  MoreVertical,
  ShieldBan,
  ShieldCheck,
  User2,
  UserX2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

const ManageMembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";

  const { server, isAdmin, isOwner } = data as {
    server?: ServerWithMembersWithProfile & {
      roles?: Role[];
    };
    isOwner: boolean;
    isAdmin: boolean;
  };

  const onRoleChange = async (memberId: string, roleId: string) => {
    try {
      setLoadingId(memberId);
      const res = await axios.patch(`/api/servers/${server?.slug}/members`, {
        memberId,
        roleId,
      });
      router.refresh();
      onOpen("members", { server: res.data, isAdmin, isOwner });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRemove = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const res = await axios.patch(
        `/api/servers/${server?.slug}/members/${memberId}`,
        {
          serverId: server?.id,
        }
      );
      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar imageUrl={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <User2 className="w-4 h-4 mr-2" />
                          <span>Roles</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {isOwner &&
                              server.roles.map(
                                (role) =>
                                  role.name !== "owner" && (
                                    <DropdownMenuItem
                                      key={role.id}
                                      onClick={() =>
                                        onRoleChange(member.id, role.id)
                                      }
                                    >
                                      {role.name}
                                      <div className="ml-auto flex">
                                        {member.roles
                                          .map((memberRole) => memberRole.name)
                                          .includes(role.name) ? (
                                          <Check className="h-4 w-4 ml-auto text-emerald-500" />
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </DropdownMenuItem>
                                  )
                              )}
                            {!isOwner &&
                              isAdmin &&
                              server.roles.map(
                                (role) =>
                                  role.name !== "owner" &&
                                  !role.administrator && (
                                    <DropdownMenuItem
                                      key={role.id}
                                      onClick={() =>
                                        onRoleChange(member.id, role.id)
                                      }
                                    >
                                      {role.name}
                                      <div className="ml-auto flex">
                                        {member.roles
                                          .map((memberRole) => memberRole.name)
                                          .includes(role.name) ? (
                                          <Check className="h-4 w-4 ml-auto text-emerald-500" />
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </DropdownMenuItem>
                                  )
                              )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      {!member.roles
                        .map((memberRole) => memberRole.name)
                        .includes("owner") && (
                        <div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-rose-500"
                            onClick={() => onRemove(member.id)}
                          >
                            <div className="flex gap-x-2">
                              <UserX2 className="h-4 w-4" />
                              <p>Remove</p>
                            </div>
                          </DropdownMenuItem>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
