import { userWithProfile } from "@/lib/user-with-profile";
import { redirect } from "next/navigation";
import React from "react";
import UserInfo from "./user-info";
import Escape from "./escape";

type Props = {};

const UserSettingsPage = async (props: Props) => {
  const user = await userWithProfile();

  if (!user) {
    return redirect(`/`);
  }

  return (
    <div className="mt-10 px-12 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 font-bold text-2xl">Profile</h1>
        <div className="lg:hidden sm:block">
          <Escape />
        </div>
      </div>
      <div className="w-full h-full p-4 gap-4">
        <UserInfo user={user} />
      </div>
    </div>
  );
};

export default UserSettingsPage;
