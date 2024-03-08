"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ban, Check, X } from "lucide-react";
import { FriendRequest, Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Separator } from "../ui/separator";

type Props = {
  requests: (FriendRequest & {
    profileOne: Profile;
  })[];
};

const FriendRequest = ({ requests }: Props) => {
  const router = useRouter();

  const onCopy = (hashtag: string) => {
    // toast goes here
    navigator.clipboard.writeText(hashtag);
  };

  const onClick = (profileId: string) => {
    router.push(`/dms/${profileId}`);
  };

  const onAccept = async (requestId: string) => {
    try {
      await axios.post(`/api/friends/${requestId}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const onReject = async (requestId: string) => {
    try {
      await axios.delete(`/api/friends/${requestId}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition my-2"
            disabled={requests.length === 0 ? true : false}
          >
            <p className="text-left line-clamp-1 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
              Friend requests
            </p>
            <span className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
              ({requests.length})
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col bg-transparent p-0 mb-2 border-none gap-y-2">
          {requests.map((request) => (
            <DropdownMenuItem
              key={request.id}
              className="w-full flex gap-y-2 p-0 m-0 bg-white dark:bg-[#313338] gap-x-2 px-2 py-1"
            >
              <div className="flex flex-col">
                <button
                  className="group rounded-md items-center gap-x-2 w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1"
                  onClick={() => onClick(request.profileOne.id)}
                >
                  <p className="text-left text-sm line-clamp-1 mr-auto text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                    {request.profileOne.name}
                  </p>
                </button>
                <button
                  className="group rounded-md items-center gap-x-2 w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1"
                  onClick={() => onCopy(request.profileOne.hashtag)}
                >
                  <span className="text-left text-xs mr-auto text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                    {request.profileOne.hashtag}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-x-1 ml-auto">
                <button
                  className="group rounded-md flex items-center w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1"
                  onClick={() => onReject(request.id)}
                >
                  <X className="ml-auto h-4 w-4 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                </button>
                <button
                  className="group rounded-md flex items-center w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1"
                  onClick={() => onAccept(request.id)}
                >
                  <Check className="ml-auto h-4 w-4 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                </button>
                {/* <button
                className="group rounded-md flex items-center w-full h-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-1"
                onClick={onAccept}
                >
                <Ban className="ml-auto h-4 w-4 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
              </button> */}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator className="h-[1px]" />
    </>
  );
};

export default FriendRequest;
