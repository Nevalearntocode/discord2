"use client";

import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw, Unlock } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { FcPrivacy } from "react-icons/fc";

const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  // host
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";

  const { server, isPermitted } = data;

  const [copied, setCopied] = useState(false);
  const [isloading, setIsloading] = useState(false);

  // invite url is combination between host and invite code or server slug
  const inviteUrl = `${origin}/invite/${
    server?.public ? server.url : server?.inviteCode
  }`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  // state to control whether user wants to refresh inviteCode or change server State
  const onNew = async ({ state }: { state?: string }) => {
    try {
      setIsloading(true);
      const res = await axios.patch(`/api/servers/${server?.url}/invite-code`, {
        // role, reset or toggle state, is public or private, if public then invite code is server url
        isPermitted,
        state,
        isPublic: server?.public,
        inviteCode: server?.url,
      });
      onOpen("invite", { server: res.data, isPermitted });
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isloading}
            />
            <Button size={`icon`} onClick={onCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          {/* only render options to change server state for permitted user */}
          {isPermitted &&
            (!server?.public ? (
              <div className="flex justify-between">
                <Button
                  variant={`link`}
                  size={`sm`}
                  className="text-xs text-zinc-500 mt-4"
                  disabled={isloading}
                  onClick={() => onNew({})}
                >
                  Set to public server
                  <Unlock className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant={`link`}
                  size={`sm`}
                  className="text-xs text-zinc-500 mt-4"
                  disabled={isloading}
                  onClick={() => onNew({ state: "reset" })}
                >
                  Generate a new link
                  <RefreshCw className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Button
                variant={`link`}
                size={`sm`}
                className="text-xs text-zinc-500 mt-4"
                disabled={isloading}
                onClick={() => onNew({})}
              >
                Set server to private
                <FcPrivacy className="w-4 h-4 ml-2" />
              </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
