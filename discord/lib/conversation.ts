import { db } from "./db";

export const getOrCreateConversation = async (
  profileOneId: string,
  profileTwoId: string
) => {
  let conversation =
    (await findConversation(profileOneId, profileTwoId)) ||
    (await findConversation(profileTwoId, profileOneId));

  if (!conversation) {
    createConversation(profileOneId, profileTwoId);
  }

  return conversation;
};
const findConversation = async (profileOneId: string, profileTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ profileOneId }, { profileTwoId }],
      },
      include: {
        profileOne: true,
        profileTwo: true,
      },
    });
  } catch {
    return null;
  }
};

const createConversation = async (
  profileOneId: string,
  profileTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        profileOneId,
        profileTwoId,
      },
      include: {
        profileOne: true,
        profileTwo: true,
      },
    });
  } catch {
    return null;
  }
};
