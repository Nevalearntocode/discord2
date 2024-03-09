import UserSettings from "@/components/settings/user-settings";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    profileId: string;
  };
};

const ProfileSettingsLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect(`/`);
  }

  return (
    <div className="h-full mx-2 flex">
      <div className="lg:pl-52 dark:bg-[#313338]">
        <div className="w-44 h-full pt-12">
          <UserSettings profile={profile} />
        </div>
      </div>
      <main className="bg-zinc-700/95 w-full">{children}</main>
      <div className="lg:pr-80 bg-zinc-700/95" />
    </div>
  );
};

export default ProfileSettingsLayout;
