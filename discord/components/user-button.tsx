"use client";

import React from "react";
import { Button } from "./ui/button";
import { UserAvatar } from "./avatar";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";

const UserButton = ({ profile }: { profile: Profile }) => {
  const router = useRouter();

  return (
    <Button
      variant={`ghost`}
      size={`icon`}
      className="rounded-full"
      onClick={() => router.push(`/usersettings/${profile.id}`)}
    >
      <UserAvatar imageUrl={profile.imageUrl} className="h-[48px] w-[48px]" />
    </Button>
  );
};

export default UserButton;
