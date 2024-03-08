"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, UserPlus2, X } from "lucide-react";
import { Separator } from "../ui/separator";

type Props = {};

const FriendRequest = (props: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition my-2">
          <p className="text-left line-clamp-1 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
            Friend requests
          </p>
          <span className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
            (1)
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-2 bg-transparent p-0 my-2 border-none">
        <DropdownMenuItem className="w-full flex gap-y-2 p-0 m-0 items-center justify-center bg-white dark:bg-[#313338] gap-x-2 px-2 py-1">
          <div className="flex flex-col">
            <button className="group rounded-md items-center gap-x-2 w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1">
              <p className="text-sm text-left mr-auto text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                Calmeneva
              </p>
            </button>
            <button className="group rounded-md items-center gap-x-2 w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1">
              <span className="text-xs text-left mr-auto text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                calmeneva#1105
              </span>
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <button className="group rounded-md flex items-center w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1">
              <X className="ml-auto h-6 w-6 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
            </button>
            <button className="group rounded-md flex items-center w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1">
              <Check className="ml-auto h-6 w-6 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
            </button>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FriendRequest;
