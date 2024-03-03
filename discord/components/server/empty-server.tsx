"use client";

import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { Channel, Server } from "@prisma/client";

type Props = {
  server: Server & {
    channels: Channel[];
  };
};

const EmptyServer = ({ server }: Props) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button
        variant={`ghost`}
        onClick={() => onOpen("createChannel", { server })}
      >
        <p className="font-semibold md:text-lg">Create a new text channel</p>
        <Plus className="ml-2 rounded-full h-4 w-4" />
      </Button>
    </div>
  );
};

export default EmptyServer;
