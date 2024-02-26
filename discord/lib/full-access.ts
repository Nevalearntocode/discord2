import { db } from "./db";

export const getFullAccess = async (serverUrl: string) => {
  const member = await db.member.findMany({
    where: {
      server: {
        url: serverUrl,
      },
      roles: {
        every: {
          permission: "FULLACCESS",
        },
      },
    },
  });

  return member;
};
