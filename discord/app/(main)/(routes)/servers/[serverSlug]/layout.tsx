import React from "react";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import ServerSidebar from "@/components/server/server-sidebar";
import MemberSidebar from "@/components/server/member-sidebar";

type Props = {
  children: React.ReactNode;
  params: {
    serverSlug: string;
  };
};

const ServerSlugLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      slug: params.serverSlug,
      OR: [
        {
          public: true,
        },
        {
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
      ],
    },
  });

  if (!server) {
    return redirect(`/`);
  }

  return (
    <div className="h-full flex">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverSlug={params.serverSlug} />
      </div>
      <main className="h-full w-full md:pl-60">{children}</main>
      <div className="hidden lg:flex h-full w-[312px] z-20 flex-col inset-y-0 ml-auto">
        <MemberSidebar serverSlug={params.serverSlug} />
      </div>
    </div>
  );
};

export default ServerSlugLayout;
