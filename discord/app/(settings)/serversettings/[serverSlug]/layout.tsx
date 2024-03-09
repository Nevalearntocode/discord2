import ServerSettings from "@/components/server/server-settings";
import UserSettings from "@/components/settings/user-settings";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    serverSlug: string;
  };
};

const ServerSettingsLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      slug: params.serverSlug,
    },
  });

  if (!server) {
    return redirect(`/`);
  }

  return (
    <div className="h-full mx-2 flex">
      <div className="lg:pl-52 dark:bg-[#313338]">
        <div className="w-44 h-full pt-12">
          <ServerSettings server={server} />
        </div>
      </div>
      <main className="bg-zinc-700/95 w-full">{children}</main>
      <div className="lg:pr-80 bg-zinc-700/95" />
    </div>
  );
};

export default ServerSettingsLayout;
