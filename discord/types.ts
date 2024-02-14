import { Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
  members: {
    profile: Profile;
  }[];
};
