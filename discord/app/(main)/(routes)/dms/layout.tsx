import React from "react";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import DMSidebar from "@/components/dms/dm-sidebar";
import OtherUserProfile from "@/components/dms/other-user-profile";

type Props = {
  children: React.ReactNode;
  params: {
    serverUrl: string;
  };
};

const ServerUrlLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  return (
    <div className="h-full flex">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <DMSidebar />
      </div>
      <main className="h-full w-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerUrlLayout;
