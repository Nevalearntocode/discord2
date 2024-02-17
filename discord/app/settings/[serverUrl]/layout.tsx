import NavigationSettings from "@/components/navigation/navigation-settings";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    serverUrl: string;
  };
};

const SettingsLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  if (!params.serverUrl) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      url: params.serverUrl,
      members: {
        some: {
          AND: [
            { profileId: profile.id },
            {
              roles: {
                some: {
                  permission: "FULLACCESS",
                },
              },
            },
          ],
        },
      },
    },
    include: {
      roles: true,
    },
  });

  if (!server) {
    return redirect(`/`);
  }

  return (
    <div className="h-full mx-2 flex">
      <div className="lg:pl-52 dark:bg-[#313338]">
        <div className="w-44 h-full pt-12">
          <NavigationSettings server={server} />
        </div>
      </div>
      <main className="bg-zinc-700/95 w-full">{children}</main>
      <div className="lg:pr-80 bg-zinc-700/95" />
    </div>
  );
};

export default SettingsLayout;
