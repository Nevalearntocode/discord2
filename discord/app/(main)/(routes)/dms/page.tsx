"use client";

import DMNavItem from "@/components/dms/dm-nav-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type Props = {};

const DMsPage = (props: Props) => {
  const [status, setStatus] = useState("all");
  const session = useSession();

  const routes = [
    {
      status: `all`,
      label: "All",
      active: status === `all`,
      disable: status === "all",
    },
    {
      status: `online`,
      label: "Online",
      active: status === `online`,
      disable: status === "online",
    },
    {
      status: `pending`,
      label: "Pending",
      active: status === `pending`,
      disable: status === "pending",
    },
    {
      status: `block`,
      label: "Block",
      active: status === `block`,
      disable: status === "block",
    },
    {
      status: `add friend`,
      label: "Add friend",
      active: status === `add friend`,
      disable: status === "add friend",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <div className="text-md font-semibold px-3 flex items-center h-[53.5px] border-neutral-200 dark:border-neutral-800 border-b-2">
        <div className="flex gap-x-4 justify-center items-center">
          {routes.map((route) => (
            <Button
              key={route.status}
              className={cn(
                "font-semibold flex items-center justify-center w-full border-none text-zinc-400 dark:hover:bg-zinc-700/30 dark:hover:text-zinc-400 rounded-md p-0 px-6",
                route.active &&
                  "text-zinc-200 dark:bg-zinc-700 dark:hover:text-zinc-300",
                route.status === "add friend" && "text-emerald-500"
              )}
              variant={`ghost`}
              size={"lg"}
              onClick={() => setStatus(route.status)}
              disabled={route.disable}
            >
              {route.label}
            </Button>
          ))}
        </div>
      </div>
      <DMNavItem status={status} />
    </div>
  );
};

export default DMsPage;
