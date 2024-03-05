import { db } from "./db";

export const getReadOnly = async (serverUrl: string) => {
  const member = await db.member.findMany({
    where: {
      server: {
        url: serverUrl,
      },
      roles: {
        every: {
          permission: "READONLY",
        },
        none: {
          AND: [
            {
              permission: "FULLACCESS",
            },
            {
              permission: "ACCESS",
            },
          ],
        },
      },
    },
  });

  return member;
};
