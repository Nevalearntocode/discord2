import { db } from "./db";

export const getChannel = async (serverUrl: string, memberId: string) => {
  const fullAccessChannel = await db.channel.findMany({
    where: {
      server: {
        url: serverUrl,
      },
      members: {
        some: {
          fullAccessChannels: {
            some: {
              id: memberId,
            },
          },
        },
      },
    },
  });

  const accessChannel = await db.channel.findMany({
    where: {
      server: {
        url: serverUrl,
      },
      members: {
        some: {
          channels: {
            some: {
              id: memberId,
            },
          },
        },
      },
    },
  });

  return { accessChannel, fullAccessChannel };
};
