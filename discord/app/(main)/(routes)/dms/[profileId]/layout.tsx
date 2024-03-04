import OtherUserProfile from "@/components/dms/other-user-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    profileId: string;
  };
};

const ProfileIdLayout = async ({ children, params }: Props) => {
  const otherProfile = await db.profile.findUnique({
    where: {
      id: params.profileId,
    },
  });

  if (!otherProfile) {
    return redirect(`/`);
  }

  return (
    <div className="flex justify-between">
      <main className="flex-1 w-full">{children}</main>
      <div className="hidden lg:block w-80">
        <OtherUserProfile profile={otherProfile} />
      </div>
    </div>
  );
};

export default ProfileIdLayout;
