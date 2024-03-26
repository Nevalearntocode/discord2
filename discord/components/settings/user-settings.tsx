"use client";

import { cn } from "@/lib/utils";
import { Profile, User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {
  user: User & {
    profile: Profile | null;
  };
};

const UserSettings = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const profile = user.profile;

  const onLogOut = () => {
    signOut();
  };

  const routes = [
    {
      href: `/usersettings/${profile?.id}`,
      label: "Profile",
      active: pathname === `/usersettings/${profile?.id}`,
    },
  ];

  return (
    <div className="h-full flex flex-col text-zinc-400">
      <div className="font-bold uppercase text-xs mb-4 px-4">User settings</div>
      <ScrollArea>
        {routes.map((route) => (
          <div key={route.href}>
            <Button
              onClick={() => router.push(route.href)}
              className={cn(
                "px-4 font-semibold flex items-center justify-start w-5/6 border-none text-zinc-400 dark:hover:bg-zinc-700/30 dark:hover:text-zinc-400 rounded-md my-1  ",
                route.active &&
                  "text-zinc-200 dark:bg-zinc-700 dark:hover:text-zinc-300"
              )}
              variant={`ghost`}
            >
              {route.label}
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto mb-4">
        <Button
          type="button"
          onClick={onLogOut}
          className={cn(
            "px-4 font-semibold flex items-center justify-between w-5/6 border-none text-zinc-400 dark:hover:bg-zinc-700/30 dark:hover:text-zinc-400 rounded-md my-1"
          )}
          variant={`secondary`}
        >
          <p className="mr-2">Log Out</p>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;
