import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Channel } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    inviteCode: string;
  };
};

const InvitePage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  if (!params.inviteCode) {
    return redirect(`/`);
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
    include: {
      channels: true,
      members: true,
    },
  });

  const member = server.members.find(
    (member) => member.profileId === profile.id
  );

  if (!member) {
    return;
  }
  // connect member to all channels in server
  await db.server.update({
    where: {
      id: server.id,
    },
    data: {
      members: {
        update: {
          where: {
            id: member.id,
            profileId: profile.id,
          },
          data: {
            channels: {
              connect: server.channels,
            },
          },
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.url}`);
  }

  return <div>InvitePage</div>;
};

export default InvitePage;
