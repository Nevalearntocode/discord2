import { auth } from "@/auth";
import { db } from "./db";

export const userWithProfile = async () => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return null;
  }

  const currentUser = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
};
