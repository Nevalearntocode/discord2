import { db } from "./db";

export const getAccess = async (serverUrl: string) => {
  const member = await db.member.findMany({
    where: {
      server: {
        url: serverUrl,
      },
      roles: {
        every: {
          permission: "ACCESS",
        },
        none: {
          permission: "FULLACCESS",
        },
      },
    },
  });

  return member;
};
