import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ServerForm from "./_components/server-form";

type Props = {
  params: {
    serverUrl: string;
  };
};

const OverviewPage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  if (!params.serverUrl) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      url: params.serverUrl,
      members: {
        some: {
          AND: [
            { profileId: profile.id },
            {
              roles: {
                some: {
                  permission: "FULLACCESS",
                },
              },
            },
          ],
        },
      },
    },
  });

  if (!server) {
    return redirect(`/`);
  }

  return (
    <div className="mt-12 pl-12 font-semibold gap-y-4 flex flex-col">
      Server Overview
      <div>
        <ServerForm server={server} />
      </div>
    </div>
  );
};

export default OverviewPage;
