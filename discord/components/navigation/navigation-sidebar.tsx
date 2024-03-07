import React from "react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";

import { currentProfile } from "@/lib/current-profile";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";
import UserButton from "../user-button";
import DMsNav from "../chat/dms-nav";

type Props = {};

const NavigationSidebar = async ({}: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 pb-6 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3">
      <DMsNav />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      {/* scroll area to render servers which profile is aparted of */}
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              slug={server.slug}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      {/* create server action */}
      <NavigationAction />
    </div>
  );
};

export default NavigationSidebar;
