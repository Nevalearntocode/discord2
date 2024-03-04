import { auth } from "@/auth";
import { db } from "./db";

export const currentProfile = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const userId = session.user.id;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
