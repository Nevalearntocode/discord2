import UserSettings from "@/components/settings/user-settings";
import { userWithProfile } from "@/lib/user-with-profile";
import { redirect } from "next/navigation";
import React from "react";
import Escape from "./escape";

type Props = {
  children: React.ReactNode;
};

const ProfileSettingsLayout = async ({ children }: Props) => {
  const user = await userWithProfile();

  if (!user) {
    return redirect(`/`);
  }

  return (
    <div className="h-full mx-2 flex">
      <div className="lg:pl-52 dark:bg-[#313338]">
        <div className="hidden xl:flex w-44 h-full pt-12">
          <UserSettings user={user} />
        </div>
      </div>
      <main className="bg-zinc-700/95 w-full">{children}</main>
      <div className="lg:pr-80 bg-zinc-700/95 w-44 pt-12 hidden lg:block">
        <Escape />
      </div>
    </div>
  );
};

export default ProfileSettingsLayout;
