import { Profile } from "@prisma/client";
import React from "react";

type Props = {
  profile: Profile;
};

const OtherUserProfile = ({ profile }: Props) => {
  return <div className="w-80">OtherUserProfile</div>;
};

export default OtherUserProfile;
