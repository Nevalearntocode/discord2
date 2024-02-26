"use client";

import { useEffect, useState } from "react";

import CreateServerModal from "@/components/modals/create-server-modal";
import InviteModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import ManageMembersModal from "../modals/manage-members-modal";
import CreateRolesModal from "../modals/create-roles.modal";
import CreateChannelModal from "../modals/create-channel-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      {/* recap_4 */}
      <InviteModal />
      {/* recap_5 */}
      <EditServerModal />
      <CreateRolesModal />
      {/* recap_6 */}
      <ManageMembersModal />
      {/* recap_7 */}
      <CreateChannelModal />
    </>
  );
};
