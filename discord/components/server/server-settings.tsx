"use client";

import { cn } from "@/lib/utils";
import { Server } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  server: Server;
};

const ServerSettings = ({ server }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      href: `/serversettings/${server.slug}/overview`,
      label: "Overview",
      active: pathname === `/serversettings/${server.slug}/overview`,
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
    </div>
  );
};

export default ServerSettings;
