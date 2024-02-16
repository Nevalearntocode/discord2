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
import { Permission } from "@prisma/client";
import { UserAvatar } from "@/components/avatar";
import { Eye, KeyRound, ShieldBan, ShieldCheck, User2 } from "lucide-react";

const roleIconMap = {
  owner: <KeyRound className="h-4 w-4 ml-2 text-yellow-500" />,
  FULLACCESS: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ACCESS: <User2 className="h-4 w-4 ml-2" />,
  READONLY: <Eye className="h-4 w-4 ml-2" />,
  BLOCKED: <ShieldBan className="h-4 w-4 ml-2" />,
};

const ManageMembersModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState("second");

  const isModalOpen = isOpen && type === "members";

  const { server, isPermitted } = data as {
    server: ServerWithMembersWithProfile;
    isPermitted: boolean;
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
                  {member.roles.find((role) => role.name === "owner")
                    ? roleIconMap["owner"]
                    : member.roles.find(
                        (role) => role.permission === Permission.FULLACCESS
                      )
                    ? roleIconMap["FULLACCESS"]
                    : member.roles.find(
                        (role) => role.permission === Permission.ACCESS
                      )
                    ? roleIconMap["ACCESS"]
                    : member.roles.find(
                        (role) => role.permission === Permission.READONLY
                      )
                    ? roleIconMap["READONLY"]
                    : roleIconMap["BLOCKED"]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {!member.roles.find((role) => role.name === "owner") && (
                <div className="ml-auto">Actions</div>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
