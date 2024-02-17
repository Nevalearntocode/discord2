"use client";

import { cn } from "@/lib/utils";
import { Role, Server } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  server: Server & {
    roles: Role[];
  };
};

const NavigationSettings = ({ server }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      href: `/settings/${server.url}`,
      label: "Overview",
      active: pathname === `/settings/${server.url}`,
    },
    {
      href: `/settings/${server.url}/roles`,
      label: "Roles",
      active: pathname === `/settings/${server.url}/roles`,
    },
  ];

  return (
    <div className="h-full flex flex-col text-zinc-400">
      <div className="font-bold uppercase text-xs mb-4 px-4">{server.name}</div>
      <ScrollArea>
        {routes.map((route) => (
          <div key={route.href}>
            <Button
              onClick={() => router.push(route.href)}
              className={cn(
                "px-4 font-semibold flex items-start justify-start w-5/6 border-none text-zinc-400 dark:hover:bg-zinc-700/30 dark:hover:text-zinc-400 rounded-md my-1  ",
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

export default NavigationSettings;
