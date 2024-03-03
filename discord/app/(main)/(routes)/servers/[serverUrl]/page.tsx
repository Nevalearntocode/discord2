import EmptyServer from "@/components/server/empty-server";
import { Button } from "@/components/ui/button";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverUrl: string;
  };
};

const ServerIdPage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      url: params.serverUrl,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          type: "TEXT",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect(`/`);
  }

  if (server?.channels.length === 0) {
    return <EmptyServer server={server} />;
  }

  const initialChannel = server?.channels[0];

  if (!initialChannel) {
    return redirect(`/servers/${params.serverUrl}`);
  }

  return redirect(`/servers/${params.serverUrl}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
