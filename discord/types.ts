import { Member, Profile, Role, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & {
    profile: Profile;
  } & {
    roles: Role[];
  })[];
} & {
  roles: Role[];
};
